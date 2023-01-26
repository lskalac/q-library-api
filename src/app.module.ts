import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {migrations} from './typeorm/migrations';
import {entites} from './typeorm/entities';
import {BooksService} from './services/books/books.service';
import {BooksController} from './controllers/books/books.controller';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
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
				};
			},
		}),
		TypeOrmModule.forFeature(entites),
	],
	controllers: [BooksController],
	providers: [BooksService],
})
export class AppModule {}
