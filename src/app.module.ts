import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigService} from '@nestjs/config';
import { async } from 'rxjs';
import { entites } from './typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async( configService: ConfigService) => {
        return {
          type: 'postgres',
          logging: true,
          entities: entites,
          host: configService.get('DATABASE_HOST'),
          port: configService.get('DATABASE_PORT'),
          username: configService.get('DATABASE_USER'),
          database: configService.get('DATABASE_NAME'),
          password: configService.get('DATABASE_PASSWORD'),
        }
      }
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
