import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	InternalServerErrorException,
	NotFoundException,
	Param,
	Post,
	Put,
	Request,
} from '@nestjs/common';
import {BooksService} from 'src/services/books/books.service';
import {
	ApiTags,
	ApiOkResponse,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiForbiddenResponse,
} from '@nestjs/swagger';
import {BookDto} from 'src/dtos/books/Book.dto';
import {CreateBookDto} from 'src/dtos/books/CreateBook.dto';
import {UserRole} from 'src/typeorm/entities/User';
import {JwtSignPayload} from 'src/dtos/auth/LoginPayload.dto';
import {Book} from 'src/typeorm/entities';

@ApiTags('books')
@Controller('books')
export class BooksController {
	constructor(private bookService: BooksService) {}

	@Get()
	@ApiOkResponse({
		isArray: true,
		type: BookDto,
		description: 'Requested books',
	})
	get(@Request() req): Promise<BookDto[]> {
		const {user} = req;
		const authorId = user.role === UserRole.ADMIN ? user.id : undefined;
		return this.bookService.get(authorId);
	}

	@Get(':id')
	@ApiOkResponse({type: BookDto, description: 'Requested book'})
	@ApiForbiddenResponse({description: 'User does not have permission for this action'})
	async getById(@Param('id') id: string, @Request() req): Promise<BookDto> {
		const book = await this.bookService.getById(id);
		await this.validateBookOwnership(req.user, book.authorId);
		return book;
	}

	@Post()
	@ApiCreatedResponse({
		type: BookDto,
		description: 'Book successfully created',
	})
	@ApiForbiddenResponse({description: 'User does not have permission for this action'})
	async create(
		@Body() book: CreateBookDto,
		@Request() req
	): Promise<BookDto> {
		await this.validateBookOwnership(req.user, book.authorId);

		return this.bookService.create(book);
	}

	@Put(':id')
	@ApiOkResponse({description: 'Book sucessfully updated'})
	@ApiNotFoundResponse({description: 'Requested book not found'})
	@ApiForbiddenResponse({description: 'User does not have permission for this action'})
	async update(
		@Param('id') id: string,
		@Body() book: CreateBookDto,
		@Request() req
	): Promise<void> {
		await this.validateExistanceAndOwnership(id, req.user);

		const result = await this.bookService.update(id, book);
		if (!result) throw new InternalServerErrorException();

		return;
	}

	@Delete(':id')
	@ApiOkResponse({description: 'Book sucessfully deleted'})
	@ApiNotFoundResponse({description: 'Requested book not found'})
	@ApiForbiddenResponse({description: 'User does not have permission for this action'})
	async delete(@Param('id') id: string, @Request() req): Promise<void> {
		await this.validateExistanceAndOwnership(id, req.user);

		const result = await this.bookService.delete(id);
		if (!result) throw new InternalServerErrorException();

		return;
	}

	private async checkBookExistance(id: string): Promise<Book> {
		const existingBook = await this.bookService.getById(id);
		if (!existingBook)
			throw new NotFoundException(`Book with identifier ${id} not found`);

		return existingBook;
	}

	private async validateBookOwnership(
		user: JwtSignPayload,
		authorId: string
	): Promise<void> {
		if (user.role !== UserRole.ADMIN || authorId !== user.id)
			throw new ForbiddenException();
	}

	private async validateExistanceAndOwnership(
		id: string,
		user: JwtSignPayload
	): Promise<void> {
		const book = await this.checkBookExistance(id);
		this.validateBookOwnership(user, book.authorId);
	}
}
