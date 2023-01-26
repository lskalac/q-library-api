import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	Post,
	UseInterceptors,
} from '@nestjs/common';
import {CreateUserDto} from 'src/dtos/users/CreateUser.dto';
import {UserDto} from 'src/dtos/users/User.dto';
import {UsersService} from 'src/services/users/users.service';
import {
	ApiConflictResponse,
	ApiTags,
	ApiCreatedResponse,
	ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(private userService: UsersService) {}

	@ApiOkResponse({
		description: 'Requested users',
		type: UserDto,
		isArray: true,
	})
	@Get()
	async get(): Promise<UserDto[]> {
		const result = await this.userService.get();
		return result.map((x) => new UserDto(x));
	}

	@ApiOkResponse({description: 'Requested user', type: UserDto})
	@Get(':id')
	async getById(@Param('id') id: string): Promise<UserDto | null> {
		const result = await this.userService.getById(id);
		return result ? new UserDto(result) : result;
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@ApiCreatedResponse({
		description: 'User successfully created',
		type: UserDto,
	})
	@ApiConflictResponse({description: 'User with given email already exists'})
	@Post()
	async create(@Body() user: CreateUserDto): Promise<UserDto> {
		const result = await this.userService.create(user);
		return new UserDto(result);
	}
}
