import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { fixtures } from './films.fixtures';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: {
            getFilms: jest.fn(),
            getSchedule: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    filmsService = module.get<FilmsService>(FilmsService);
  });

  describe('getFilms', () => {
    it('возвращает список фильмов от сервиса', async () => {
      const expected = { total: 1, items: [fixtures.films[0]] };
      (filmsService.getFilms as jest.Mock).mockResolvedValue(expected);

      const result = await controller.getFilms();

      expect(result).toEqual(expected);
    });

    it('пробрасывает ошибку из сервиса без обработки', async () => {
      (filmsService.getFilms as jest.Mock).mockRejectedValue(
        new Error('db down'),
      );

      await expect(controller.getFilms()).rejects.toThrow('db down');
    });
  });

  describe('getSchedule', () => {
    const filmId = '5b70cb1a-61c9-47b1-b207-31f9e89087ff';

    it('возвращает расписание фильма', async () => {
      const expected = {
        total: 1,
        items: fixtures.filmWithSchedule.schedule.map((s) => ({
          id: s.id,
          daytime: s.daytime,
          hall: s.hall,
          rows: s.rows,
          seats: s.seats,
          price: s.price,
          taken: s.taken,
        })),
      };
      (filmsService.getSchedule as jest.Mock).mockResolvedValue(expected);

      const result = await controller.getSchedule(filmId);

      expect(result).toEqual(expected);
      expect(filmsService.getSchedule).toHaveBeenCalledWith(filmId);
    });

    it('пробрасывает NotFoundException, если фильма нет', async () => {
      (filmsService.getSchedule as jest.Mock).mockRejectedValue(
        new NotFoundException('Фильм не найден'),
      );

      await expect(
        controller.getSchedule(filmId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
