import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsRepository } from './films.repository';
import { fixtures } from './films.fixtures';

describe('FilmsService', () => {
  let service: FilmsService;
  let filmsRepository: FilmsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FilmsRepository,
          useValue: {
            getFilms: jest.fn(),
            getScheduleByFilm: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    filmsRepository = module.get<FilmsRepository>(FilmsRepository);
  });

  describe('getFilms', () => {
    it('возвращает { total, items } по данным репозитория', async () => {
      (filmsRepository.getFilms as jest.Mock).mockResolvedValue(
        fixtures.films,
      );

      const result = await service.getFilms();

      expect(result.total).toBe(fixtures.films.length);
      expect(result.items[0].title).toBe(fixtures.films[0].title);
      expect(result.items[0].tags).toEqual(fixtures.films[0].tags);
    });

    it('возвращает пустой список, когда фильмов нет', async () => {
      (filmsRepository.getFilms as jest.Mock).mockResolvedValue([]);

      const result = await service.getFilms();

      expect(result).toEqual({ total: 0, items: [] });
    });
  });

  describe('getSchedule', () => {
    const filmId = '5b70cb1a-61c9-47b1-b207-31f9e89087ff';

    it('возвращает расписание фильма с занятыми местами', async () => {
      (filmsRepository.getScheduleByFilm as jest.Mock).mockResolvedValue(
        fixtures.filmWithSchedule,
      );

      const result = await service.getSchedule(filmId);

      expect(result.total).toBe(1);
      expect(result.items[0].id).toBe(
        '793009d6-030c-4dd4-8d13-9ba500724b38',
      );
      expect(result.items[0].taken).toEqual([
        '3:3', '1:4', '1:5', '1:3', '1:2',
      ]);
    });

    it('возвращает пустой taken для сеанса без занятых мест', async () => {
      const film = {
        ...fixtures.filmWithSchedule,
        schedule: [{ ...fixtures.filmWithSchedule.schedule[0], taken: [] }],
      };
      (filmsRepository.getScheduleByFilm as jest.Mock).mockResolvedValue(film);

      const result = await service.getSchedule(filmId);

      expect(result.items[0].taken).toEqual([]);
    });

    it('бросает NotFoundException, если фильма нет', async () => {
      (filmsRepository.getScheduleByFilm as jest.Mock).mockResolvedValue(null);

      await expect(service.getSchedule(filmId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('передаёт filmId в репозиторий без изменений', async () => {
      (filmsRepository.getScheduleByFilm as jest.Mock).mockResolvedValue(
        fixtures.filmWithSchedule,
      );

      await service.getSchedule(filmId);

      expect(filmsRepository.getScheduleByFilm).toHaveBeenCalledWith(filmId);
    });
  });
});
