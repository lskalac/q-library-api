import {UserRole} from 'src/typeorm/entities/User';

export class JwtSignPayload {
	id: string;
	role: UserRole;
}

export class LoginPayloadDto {
	token: string;
	user: JwtSignPayload;
}
