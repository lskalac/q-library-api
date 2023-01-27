import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {migrations} from './typeorm/migrations';
import {entites} from './typeorm/entities';
import {BooksService} from './services/books/books.service';
import {UsersController} from './controllers/users/users.controller';
import {UsersService} from './services/users/users.service';
import {AuthService} from './services/auth/auth.service';
import {AuthController} from './controllers/auth/auth.controller';
import {LocalStrategy} from './services/auth/local.strategy';
import {PassportModule} from '@nestjs/passport';
import {BooksController} from './controllers/books/books.controller';
import {JwtModule} from '@nestjs/jwt';

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
		PassportModule,
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				return {
					secret: configService.get('JWT_SECRET_KEY'),
					signOptions: {
						expiresIn: '1d',
					},
				};
			},
		}),
	],
	controllers: [BooksController, UsersController, AuthController],
	providers: [BooksService, UsersService, AuthService, LocalStrategy],
})
export class AppModule {}
