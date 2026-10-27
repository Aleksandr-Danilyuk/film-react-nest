import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from './films.repository';
import { FilmsListResponse } from './dto/films.dto';
import { ScheduleListResponse } from './dto/schedule.dto';
import { toFilmsListResponse, toScheduleListResponse } from './films.converter';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getFilms(): Promise<FilmsListResponse> {
    const films = await this.filmsRepository.getFilms();
    return toFilmsListResponse(films);
  }

  async getSchedule(filmId: string): Promise<ScheduleListResponse> {
    const film = await this.filmsRepository.getScheduleByFilm(filmId);
    if (!film) {
      throw new NotFoundException('Фильм не найден');
    }
    return toScheduleListResponse(film);
  }
}
