import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  const dto: CreateOrderDto = {
    email: 'test@example.com',
    phone: '+79990000001',
    tickets: [
      {
        film: 'film-1',
        session: 'session-1',
        daytime: '2024-06-28T10:00:53+03:00',
        price: 350,
        row: 1,
        seat: 1,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  it('передаёт dto в сервис и возвращает его ответ', async () => {
    const expected = {
      total: 1,
      items: [{ ...dto.tickets[0], id: 'generated-uuid' }],
    };
    (orderService.createOrder as jest.Mock).mockResolvedValue(expected);

    const result = await controller.createOrder(dto);

    expect(result).toEqual(expected);
    expect(orderService.createOrder).toHaveBeenCalledWith(dto);
  });

  it('пробрасывает ошибку сервиса без обработки', async () => {
    (orderService.createOrder as jest.Mock).mockRejectedValue(
      new BadRequestException('Место вне зала'),
    );

    await expect(controller.createOrder(dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('вызывается ровно один раз на один запрос', async () => {
    (orderService.createOrder as jest.Mock).mockResolvedValue({
      total: 0,
      items: [],
    });

    await controller.createOrder(dto);

    expect(orderService.createOrder).toHaveBeenCalledTimes(1);
  });
});
