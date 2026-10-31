import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';

export const fixtures = {
  films: [
    {
      id: '5b70cb1a-61c9-47b1-b207-31f9e89087ff',
      rating: 8.9,
      director: 'Лила Васкес',
      tags: ['Рекомендуемые'],
      title: 'Стражи Гримуара',
      about: 'Фэнтезийное приключение об истинном значении дружбы',
      description: 'Захватывающее фэнтезийное приключение...',
      image: '/bg2s.jpg',
      cover: '/bg2c.jpg',
      schedule: [] as Schedule[],
    },
  ] as Film[],

  filmWithSchedule: {
    id: '5b70cb1a-61c9-47b1-b207-31f9e89087ff',
    rating: 8.9,
    director: 'Лила Васкес',
    tags: ['Рекомендуемые'],
    title: 'Стражи Гримуара',
    about: 'Фэнтезийное приключение об истинном значении дружбы',
    description: 'Захватывающее фэнтезийное приключение...',
    image: '/bg2s.jpg',
    cover: '/bg2c.jpg',
    schedule: [
      {
        id: '793009d6-030c-4dd4-8d13-9ba500724b38',
        daytime: '2024-06-28T10:00:53+03:00',
        hall: 0,
        rows: 5,
        seats: 10,
        price: 350,
        taken: ['3:3', '1:4', '1:5', '1:3', '1:2'],
        film: null,
      } as Schedule,
    ],
  } as Film,
};
