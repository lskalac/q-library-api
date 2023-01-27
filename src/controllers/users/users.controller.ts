import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	InternalServerErrorException,
	NotFoundException,
	Param,
	Post,
	Put,
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
	ApiNotFoundResponse,
} from '@nestjs/swagger';
import {UpdateUserDto} from 'src/dtos/users/UpdateUser.dto';
import {UserRole} from 'src/typeorm/entities/User';
import {Roles} from 'src/decorators/role.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(private userService: UsersService) {}

	@Roles(UserRole.ADMIN)
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

	@Roles(UserRole.ADMIN)
	@ApiOkResponse({description: 'Requested user', type: UserDto})
	@Get(':id')
	async getById(@Param('id') id: string): Promise<UserDto | null> {
		const result = await this.userService.getById(id);
		return result ? new UserDto(result) : result;
	}

	@Roles(UserRole.ADMIN)
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

	@ApiOkResponse({description: 'User successfully updated'})
	@ApiNotFoundResponse({description: 'Requested user not found'})
	@Put(':id')
	async update(
		@Param('id') id: string,
		@Body() user: UpdateUserDto
	): Promise<void> {
		await this.checkUserExistance(id);

		const result = await this.userService.update(id, user);
		if (!result) throw new InternalServerErrorException();

		return;
	}

	@ApiOkResponse({description: 'User successfully deactivated'})
	@ApiNotFoundResponse({description: 'Requested user not found'})
	@Put(':id/deactivate')
	async deactivate(@Param('id') id: string): Promise<void> {
		await this.checkUserExistance(id);

		const result = await this.userService.updateActive(id, false);
		if (!result) throw new InternalServerErrorException();

		return;
	}

	@Roles(UserRole.ADMIN)
	@ApiOkResponse({description: 'User successfully deleted'})
	@ApiNotFoundResponse({description: 'Requested user not found'})
	@ApiConflictResponse({description: 'Requested user can not be deleted'})
	@Delete(':id')
	async delete(@Param('id') id: string): Promise<void> {
		const result = await this.userService.delete(id);
		if (!result) throw new InternalServerErrorException();

		return;
	}

	private async checkUserExistance(id: string): Promise<void> {
		const existingUser = await this.userService.getById(id);
		if (!existingUser)
			throw new NotFoundException(`User with identifier ${id} not found`);
	}
}
