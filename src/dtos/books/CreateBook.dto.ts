import {
	IsDateString,
	IsInt,
	IsUUID,
	Max,
	MaxLength,
	Min,
} from 'class-validator';

export class CreateBookDto {
	@MaxLength(150)
	title: string;

	@MaxLength(150)
	publisher: string;

	@IsDateString()
	publishedDate: Date;

	@IsInt()
	@Min(1)
	numberOfPages: number;

	@IsInt()
	@Min(1000000000)
	@Max(9999999999)
	isbn: number;

	@IsUUID()
	authorId: string;
}
