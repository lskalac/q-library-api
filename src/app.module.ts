import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigService} from '@nestjs/config';
import { entites } from './typeorm/entities';
import { migrations } from './typeorm/migrations';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async( configService: ConfigService) => {
        return {
          type: 'postgres',
          logging: true,
          entities: entites,
          synchronize: false,
          migrations: migrations,
          migrationsTableName: 'migrations',
          migrationsRun: true,
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
