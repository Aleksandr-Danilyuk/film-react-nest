export class ScheduleDto {
  id: string;
  daytime: string;
  //daytime: Date;
  //hall: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export class ScheduleListResponse {
  total: number;
  items: ScheduleDto[];
}
