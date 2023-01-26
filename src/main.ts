import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe());

	const swaggerConfig = new DocumentBuilder()
		.setTitle('Q Library')
		.setDescription(
			'Q Library is REST API of endpoints for managing authors and book inside library.'
		)
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('docs', app, document);

	await app.listen(7000);
}
bootstrap();
