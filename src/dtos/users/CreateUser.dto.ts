import {IsEmail, IsEnum, IsOptional, Matches, MaxLength} from 'class-validator';
import {Match} from 'src/decorators/match.decorator';
import {UserRole} from 'src/typeorm/entities/User';

export class CreateUserDto {
	@MaxLength(150)
	firstName: string;

	@MaxLength(150)
	lastName: string;

	@IsEmail()
	email: string;

	@IsOptional()
	phone: string;

	@IsEnum(UserRole)
	role: UserRole;

	// min 8 chars, one letter and one number
	@Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
		message: 'password too weak',
	})
	password: string;

	@Match('password')
	confirmPassword: string;
}
