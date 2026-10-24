import { FilmDocument } from './schemas/film.schema';
import { FilmDto, FilmsListResponse } from './dto/films.dto';
import { ScheduleDto, ScheduleListResponse } from './dto/schedule.dto';

export function toFilmDto(film: FilmDocument): FilmDto {
  return {
    id: film.id,
    rating: film.rating,
    director: film.director,
    tags: film.tags,
    title: film.title,
    about: film.about,
    description: film.description,
    image: film.image,
    cover: film.cover,
  };
}

export function toFilmsListResponse(films: FilmDocument[]): FilmsListResponse {
  const items = films.map(toFilmDto);
  return { total: items.length, items };
}

export function toScheduleDto(schedule): ScheduleDto {
  return {
    id: schedule.id,
    daytime: schedule.daytime,
    hall: schedule.hall,
    rows: schedule.rows,
    seats: schedule.seats,
    price: schedule.price,
    taken: schedule.taken,
  };
}

export function toScheduleListResponse(
  film: FilmDocument,
): ScheduleListResponse {
  const items = (film?.schedule ?? []).map(toScheduleDto);
  return { total: items.length, items };
}
