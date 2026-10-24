import { ValidationPipe, RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.setGlobalPrefix("api/afisha");
  app.setGlobalPrefix('api/afisha', {
    // исключаем статический путь из глобального префикса
    exclude: [{ path: 'content/afisha/(.*)', method: RequestMethod.GET }],
  });
  app.useGlobalPipes(new ValidationPipe()); // валидация DTO в POST /order
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
