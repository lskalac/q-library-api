import {ConflictException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {CreateUserDto} from 'src/dtos/users/CreateUser.dto';
import {UpdateUserDto} from 'src/dtos/users/UpdateUser.dto';
import {User} from 'src/typeorm/entities';
import {hash} from 'src/utils/hash.util';
import {Repository} from 'typeorm';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>
	) {}

	get(): Promise<User[]> {
		return this.userRepository.find();
	}

	getByEmail(email: string): Promise<User | null> {
		return this.userRepository.findOneBy({email});
	}

	getById(id: string): Promise<User | null> {
		return this.userRepository.findOneBy({id});
	}

	async create(user: CreateUserDto): Promise<User> {
		const existingUser = await this.getByEmail(user.email);
		if (existingUser)
			throw new ConflictException(
				`User with email ${user.email} already exists`
			);

		const passwordHash = await hash(user.password);
		const entity = this.userRepository.create({...user, passwordHash});
		return this.userRepository.save(entity);
	}

	async update(id: string, user: UpdateUserDto): Promise<boolean> {
		return (await this.userRepository.update({id}, user)).affected === 1;
	}

	async updateActive(id: string, isActive: boolean): Promise<boolean> {
		return (
			(await this.userRepository.update({id}, {isActive})).affected === 1
		);
	}
}
