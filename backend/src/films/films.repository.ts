import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from './schemas/film.schema';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
  ) {}

  async getFilms(): Promise<FilmDocument[]> {
    return this.filmModel.find().exec();
  }

  async getScheduleByFilm(filmId: string): Promise<FilmDocument | null> {
    return this.filmModel.findOne({ id: filmId }).exec();
  }

  async findFilmBySession(sessionId: string): Promise<FilmDocument | null> {
    return this.filmModel.findOne({ 'schedule.id': sessionId }).exec();
  }

  async addTaken(sessionId: string, row: number, seat: number): Promise<void> {
    await this.filmModel
      .updateOne(
        { 'schedule.id': sessionId },
        { $push: { 'schedule.$.taken': `${row}:${seat}` } },
      )
      .exec();
  }
}
