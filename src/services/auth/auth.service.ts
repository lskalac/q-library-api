import {Injectable} from '@nestjs/common';
import {User} from 'src/typeorm/entities';
import {isMatch} from 'src/utils/hash.util';
import {UsersService} from '../users/users.service';
import {JwtService} from '@nestjs/jwt';
import {LoginPayloadDto} from 'src/dtos/auth/LoginPayload.dto';

@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService
	) {}

	async validateUser(email: string, password: string): Promise<User | null> {
		const user = await this.userService.getByEmail(email);
		return user && isMatch(password, user.passwordHash) ? user : null;
	}

	async login(user: User): Promise<LoginPayloadDto> {
		const payload = {
			id: user.id,
			role: user.role,
		};
		return {
			token: this.jwtService.sign(payload),
			user: payload,
		};
	}
}
