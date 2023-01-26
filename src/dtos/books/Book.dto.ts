import {ApiProperty} from '@nestjs/swagger';

export class BookDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	title: string;

	@ApiProperty()
	publisher: string;

	@ApiProperty()
	publishedDate: Date;

	@ApiProperty()
	numberOfPages: number;

	@ApiProperty()
	isbn: number;
}
