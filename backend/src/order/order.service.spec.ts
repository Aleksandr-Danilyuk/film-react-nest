import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { FilmsRepository } from '../films/films.repository';
import { fixtures } from '../films/films.fixtures';
import { CreateOrderDto, TicketDto } from './dto/order.dto';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

describe('OrderService', () => {
  let service: OrderService;
  let filmsRepository: FilmsRepository;

  const film = fixtures.filmWithSchedule;
  const sessionId = '793009d6-030c-4dd4-8d13-9ba500724b38';

  const makeTicket = (overrides: Partial<TicketDto> = {}): TicketDto => ({
    film: film.id,
    session: sessionId,
    daytime: '2024-06-28T10:00:53+03:00',
    price: 350,
    row: 1,
    seat: 1,
    ...overrides,
  });

  const makeDto = (tickets: TicketDto[]): CreateOrderDto => ({
    email: 'test@example.com',
    phone: '+79990000001',
    tickets,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: FilmsRepository,
          useValue: {
            findFilmBySession: jest.fn(),
            addTaken: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    filmsRepository = module.get<FilmsRepository>(FilmsRepository);
  });

  describe('успешный заказ', () => {
    it('возвращает { total, items } с сгенерированным id билета', async () => {
      (filmsRepository.findFilmBySession as jest.Mock).mockResolvedValue(film);

      const result = await service.createOrder(makeDto([makeTicket()]));

      expect(result.total).toBe(1);
      expect(result.items[0]).toMatchObject({ row: 1, seat: 1 });
      expect(result.items[0].id).toBeDefined();
    });

    it('вызывает addTaken с правильными аргументами', async () => {
      (filmsRepository.findFilmBySession as jest.Mock).mockResolvedValue(film);

      await service.createOrder(makeDto([makeTicket({ row: 2, seat: 3 })]));

      expect(filmsRepository.addTaken).toHaveBeenCalledWith(sessionId, 2, 3);
    });

    it('оформляет несколько билетов в одном заказе', async () => {
      (filmsRepository.findFilmBySession as jest.Mock).mockResolvedValue(film);

      const result = await service.createOrder(
        makeDto([makeTicket({ seat: 1 }), makeTicket({ seat: 6 })]),
      );

      expect(result.total).toBe(2);
      expect(filmsRepository.addTaken).toHaveBeenCalledTimes(2);
    });
  });

  describe('ошибки валидации', () => {
    it('бросает NotFoundException для несуществующего сеанса', async () => {
      (filmsRepository.findFilmBySession as jest.Mock).mockResolvedValue(null);

      await expect(
        service.createOrder(makeDto([makeTicket()])),
      ).rejects.toThrow(NotFoundException);
      expect(filmsRepository.addTaken).not.toHaveBeenCalled();
    });

    it('бросает BadRequestException, если ряд вне зала', async () => {
      (filmsRepository.findFilmBySession as jest.Mock).mockResolvedValue(film);

      await expect(
        service.createOrder(makeDto([makeTicket({ row: 11 })])),
      ).rejects.toThrow(BadRequestException);
      expect(filmsRepository.addTaken).not.toHaveBeenCalled();
    });

    it('бросает BadRequestException, если место вне ряда', async () => {
      (filmsRepository.findFilmBySession as jest.Mock).mockResolvedValue(film);

      await expect(
        service.createOrder(makeDto([makeTicket({ seat: 99 })])),
      ).rejects.toThrow(BadRequestException);
    });

    it('бросает ConflictException, если место уже занято', async () => {
      (filmsRepository.findFilmBySession as jest.Mock).mockResolvedValue(film);

      await expect(
        service.createOrder(makeDto([makeTicket({ row: 3, seat: 3 })])),
      ).rejects.toThrow(ConflictException);
      expect(filmsRepository.addTaken).not.toHaveBeenCalled();
    });
  });

  describe('частичный отказ в заказе из нескольких билетов', () => {
    it('не сохраняет booked места при ошибке на втором билете', async () => {
      (filmsRepository.findFilmBySession as jest.Mock).mockResolvedValue(film);

      // первый билет валиден, второй — занятое место 3:3
      await expect(
        service.createOrder(
          makeDto([makeTicket({ seat: 1 }), makeTicket({ row: 3, seat: 3 })]),
        ),
      ).rejects.toThrow(ConflictException);

      // но первый билет уже был обработан — addTaken вызван
      expect(filmsRepository.addTaken).toHaveBeenCalledTimes(1);
    });
  });
});
