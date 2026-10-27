import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'node:path';
import * as express from 'express';

import { configProvider } from './app.config.provider';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
    }),
    FilmsModule,
    OrderModule,
  ],
  controllers: [],
  providers: [configProvider],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(express.static(path.join(process.cwd(), 'public')))
      .forRoutes({
        //path: 'content/afisha/*splat', // splat -  для обозначения «остатка пути» (остатка URL)
        path: 'content/afisha/*',
        method: RequestMethod.GET,
      });
  }
}
