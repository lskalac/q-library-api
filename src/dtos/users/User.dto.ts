import {ApiHideProperty, ApiProperty} from '@nestjs/swagger';
import {Exclude} from 'class-transformer';
import {User} from 'src/typeorm/entities';
import {UserRole} from 'src/typeorm/entities/User';

export class UserDto {
	@Exclude()
	@ApiHideProperty()
	passwordHash: string;

	@ApiProperty()
	id: string;

	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	phone: string;

	@ApiProperty()
	role: UserRole;

	constructor(partial: Partial<User>) {
		Object.assign(this, partial);
	}
}
