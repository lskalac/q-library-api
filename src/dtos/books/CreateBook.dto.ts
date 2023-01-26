import { IsDate, IsInt, Length, MaxLength, Min } from 'class-validator';

export class CreateBookDto {
    @MaxLength(150)
    title: string;

    @MaxLength(150)
    publisher: string;

    @IsDate()
    publishedDate: Date;

    @IsInt()
    @Min(1)
    numberOfPages: number;

    @IsInt()
    @Length(10)
    isbn: number;
}