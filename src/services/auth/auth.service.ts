import { Injectable } from '@nestjs/common';
import { User } from 'src/typeorm/entities';
import { isMatch } from 'src/utils/hash.util';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService){}

    async validateUser(email: string, password: string): Promise<User | null>{
        const user = await this.userService.getByEmail(email);
        return user && isMatch(password, user.passwordHash) ? user : null;
    }
}
