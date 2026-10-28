import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';

type ScheduleView = Omit<Schedule, 'taken'> & { taken: string[] };
type FilmView = Omit<Film, 'schedule'> & { schedule: ScheduleView[] };

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

  async findFilmBySession(sessionId: string): Promise<FilmView | null> {
    const film = await this.filmsRepo.findOne({
      where: { schedule: { id: sessionId } },
      relations: { schedule: true },
    });
    if (!film) return null;

    return {
      ...film,
      schedule: film.schedule.map((s) => ({
        ...s,
        taken: s.taken ? s.taken.split(',') : [],
      })),
    };
  }

  async addTaken(sessionId: string, row: number, seat: number): Promise<void> {
    await this.schedulesRepo.query(
      `UPDATE schedules
         SET taken = CASE WHEN taken = '' THEN $1 ELSE taken || ',' || $1 END
       WHERE id = $2`,
      [`${row}:${seat}`, sessionId],
    );
  }
}
