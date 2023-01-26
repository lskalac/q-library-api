import {IsOptional, MaxLength} from 'class-validator';

export class UpdateUserDto {
	@MaxLength(150)
	firstName: string;

	@MaxLength(150)
	lastName: string;

	@IsOptional()
	phone: string;
}
