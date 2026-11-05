import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmsRepo: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly schedulesRepo: Repository<Schedule>,
  ) {}

  async getFilms(): Promise<Film[]> {
    return this.filmsRepo.find();
  }

  async getScheduleByFilm(filmId: string): Promise<Film | null> {
    return this.filmsRepo.findOne({
      where: { id: filmId },
      relations: { schedule: true },
    });
  }

  async findFilmBySession(sessionId: string): Promise<Film | null> {
    return this.filmsRepo.findOne({
      where: { schedule: { id: sessionId } },
      relations: { schedule: true },
    });
  }

  async addTaken(sessionId: string, row: number, seat: number): Promise<void> {
    const schedule = await this.schedulesRepo.findOneBy({ id: sessionId });
    if (!schedule) return;

    schedule.taken.push(`${row}:${seat}`);
    await this.schedulesRepo.save(schedule);
  }
}
