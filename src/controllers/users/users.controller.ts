import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/users/CreateUser.dto';
import { UserDto } from 'src/dtos/users/User.dto';
import { UsersService } from 'src/services/users/users.service';
import { ApiConflictResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService){
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @ApiCreatedResponse({description: 'User successfully created', type: UserDto})
    @ApiConflictResponse({description: 'User with given email already exists'})
    @Post()
    async create(@Body() user: CreateUserDto): Promise<UserDto>{
        const result = await this.userService.create(user);
        return new UserDto(result);
    }
}
