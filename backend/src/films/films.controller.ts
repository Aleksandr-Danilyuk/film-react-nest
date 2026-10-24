import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsListResponse } from './dto/films.dto';
import { ScheduleListResponse } from './dto/schedule.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms(): Promise<FilmsListResponse> {
    return this.filmsService.getFilms();
  }

  @Get(':id/schedule')
  async getSchedule(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ScheduleListResponse> {
    return this.filmsService.getSchedule(id);
  }
}
