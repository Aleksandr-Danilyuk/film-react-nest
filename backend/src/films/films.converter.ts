import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';
import { FilmDto, FilmsListResponse } from './dto/films.dto';
import { ScheduleDto, ScheduleListResponse } from './dto/schedule.dto';

export function toFilmDto(film: Film): FilmDto {
  return {
    id: film.id,
    rating: film.rating,
    director: film.director,
    tags: film.tags ? film.tags.split(',') : [],
    title: film.title,
    about: film.about,
    description: film.description,
    image: film.image,
    cover: film.cover,
  };
}

export function toFilmsListResponse(films: Film[]): FilmsListResponse {
  const items = films.map(toFilmDto);
  return { total: items.length, items };
}

export function toScheduleDto(schedule: Schedule): ScheduleDto {
  return {
    id: schedule.id,
    daytime: schedule.daytime,
    hall: schedule.hall,
    rows: schedule.rows,
    seats: schedule.seats,
    price: schedule.price,
    taken: schedule.taken ? schedule.taken.split(',') : [],
  };
}

export function toScheduleListResponse(film: Film): ScheduleListResponse {
  const items = (film?.schedule ?? []).map(toScheduleDto);
  return { total: items.length, items };
}
