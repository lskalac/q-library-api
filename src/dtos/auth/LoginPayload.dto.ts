import {UserRole} from 'src/typeorm/entities/User';

export class LoginPayloadDto {
	token: string;
	user: {
		role: UserRole;
	};
}
