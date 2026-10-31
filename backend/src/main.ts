import { ValidationPipe, RequestMethod, LoggerService } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';
import 'dotenv/config';

function createLogger(): LoggerService {
  switch (process.env.LOGGER) {
    case 'json':
      return new JsonLogger();
    case 'tskv':
      return new TskvLogger();
    default:
      return new DevLogger();
  }
}

async function bootstrap() {
  const logger = createLogger();
  const app = await NestFactory.create(AppModule, { logger });
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
