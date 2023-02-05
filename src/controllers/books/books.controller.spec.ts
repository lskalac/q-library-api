import {Test, TestingModule} from '@nestjs/testing';
import {CreateBookDto} from 'src/dtos/books/CreateBook.dto';
import {BooksService} from 'src/services/books/books.service';
import {BooksController} from './books.controller';
import {createRequest} from 'node-mocks-http';
import {JwtSignPayload} from 'src/dtos/auth/LoginPayload.dto';
import {UserRole} from 'src/typeorm/entities/User';
import {ForbiddenException, NotFoundException} from '@nestjs/common';
import {Book} from 'src/typeorm/entities';

describe('BooksController', () => {
	let controller: BooksController;

	const id = '50617759-2980-4a9a-b238-6188ff75ca2b';
	const id2 = '5929adc1-4ed4-41a7-b763-a779df0fe8ad';
	const authorId = '550cfa0e-64fe-400c-89c5-05f31b060b47';
	const author2Id = 'b0452634-bf90-460a-9d94-4b9f080bd040';
	const adminId = 'e2996b1e-3f60-4648-b4b7-e20e22fb5c1f';
	const FORBIDDEN_EXCEPTION = 'User is not permitted for this action';

	const book: CreateBookDto = {
		title: 'Book the B',
		publisher: 'Publish&Co',
		publishedDate: new Date(),
		numberOfPages: 200,
		isbn: 1000000000,
		authorId: authorId,
	};

	const createBook = (authorId: string, id: string): Book => {
		return {
			id: id,
			title: 'Book the B',
			publisher: 'Publish&Co',
			publishedDate: new Date(),
			numberOfPages: 200,
			isbn: 1000000000,
			authorId: authorId,
		};
	};

	const books = [createBook(authorId, id), createBook(author2Id, id2)];

	beforeEach(async () => {
		const mockBookService = {
			get: jest.fn().mockImplementation((userId?: string) => {
				return books.filter((x) => !userId || x.authorId === userId);
			}),
			getById: jest.fn().mockImplementation((id: string) => {
				return books.find((x) => x.id === id);
			}),
			create: jest.fn().mockImplementation((book: CreateBookDto) => {
				return {...book, id: id};
			}),
			update: jest
				.fn()
				.mockImplementation((id: string, book: CreateBookDto) => {
					return books.find((x) => x.id === id) ? book : null;
				}),
			delete: jest.fn().mockImplementation((id: string) => {
				return !!books.find((x) => x.id === id);
			}),
		};

		const module: TestingModule = await Test.createTestingModule({
			controllers: [BooksController],
			providers: [BooksService],
		})
			.overrideProvider(BooksService)
			.useValue(mockBookService)
			.compile();

		controller = module.get<BooksController>(BooksController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('get', () => {
		it('should return only their own if user is author', async () => {
			const req = createRequest();
			req.user = {
				id: authorId,
				role: UserRole.AUTHOR,
			} as JwtSignPayload;
			expect(await controller.get(req)).toEqual(
				books.filter((x) => x.authorId === authorId)
			);
		});

		it('should return all if user is admin', async () => {
			const req = createRequest();
			req.user = {
				id: adminId,
				role: UserRole.ADMIN,
			} as JwtSignPayload;
			expect(await controller.get(req)).toEqual(books);
		});
	});

	describe('get by id', () => {
		it('should return book if user is admin', async () => {
			const req = createRequest();
			req.user = {
				id: adminId,
				role: UserRole.ADMIN,
			} as JwtSignPayload;

			expect(await controller.getById(id, req)).toEqual(
				books.find((x) => x.id === id)
			);
		});

		it('should return a book if user is owner', async () => {
			const req = createRequest();
			req.user = {
				id: authorId,
				role: UserRole.AUTHOR,
			} as JwtSignPayload;

			expect(await controller.getById(id, req)).toEqual(
				books.find((x) => x.id === id)
			);
		});

		it('should throw an error if user is not owner', async () => {
			const req = createRequest();
			req.user = {
				id: authorId,
				role: UserRole.AUTHOR,
			} as JwtSignPayload;

			await expect(controller.getById(id2, req)).rejects.toEqual(
				new ForbiddenException(FORBIDDEN_EXCEPTION)
			);
		});
	});

	describe('create', () => {
		it('author should have permission', async () => {
			const req = createRequest();
			req.user = {
				id: authorId,
				role: UserRole.AUTHOR,
			} as JwtSignPayload;
			expect(await controller.create(book, req)).toEqual({
				...book,
				id: id,
			});
		});

		it('admin should have permission', async () => {
			const req = createRequest();
			req.user = {
				id: adminId,
				role: UserRole.ADMIN,
			} as JwtSignPayload;
			expect(await controller.create(book, req)).toEqual({
				...book,
				id: id,
			});
		});

		it('author should not have permission for create a book of another user', async () => {
			const req = createRequest();
			req.user = {
				id: author2Id,
				role: UserRole.AUTHOR,
			} as JwtSignPayload;
			await expect(controller.create(book, req)).rejects.toEqual(
				new ForbiddenException(FORBIDDEN_EXCEPTION)
			);
		});
	});

	describe('update', () => {
		it('should update book if user is admin', async () => {
			const req = createRequest();
			req.user = {
				id: adminId,
				role: UserRole.ADMIN,
			} as JwtSignPayload;

			expect(await controller.update(id, book, req)).toEqual(void 0);
		});

		it('should update a book if user is owner', async () => {
			const req = createRequest();
			req.user = {
				id: authorId,
				role: UserRole.AUTHOR,
			} as JwtSignPayload;

			expect(await controller.update(id, book, req)).toEqual(void 0);
		});

		it('should throw an error if user is not owner', async () => {
			const req = createRequest();
			req.user = {
				id: authorId,
				role: UserRole.AUTHOR,
			} as JwtSignPayload;

			await expect(controller.update(id2, book, req)).rejects.toEqual(
				new ForbiddenException(FORBIDDEN_EXCEPTION)
			);
		});

		it('should throw an error if book does not exists', async () => {
			const req = createRequest();
			req.user = {
				id: authorId,
				role: UserRole.AUTHOR,
			} as JwtSignPayload;

			const id = 'testid';
			await expect(controller.update(id, book, req)).rejects.toEqual(
				new NotFoundException(`Book with identifier ${id} not found`)
			);
		});
	});

	describe('delete', () => {
		it('should delete if user is admin', async () => {
			const req = createRequest();
			req.user = {
				id: adminId,
				role: UserRole.ADMIN,
			} as JwtSignPayload;

			expect(await controller.delete(id, req)).toEqual(void 0);
		});

		it('should delete a book if user is owner', async () => {
			const req = createRequest();
			req.user = {
				id: authorId,
				role: UserRole.AUTHOR,
			} as JwtSignPayload;

			expect(await controller.delete(id, req)).toEqual(void 0);
		});

		it('should throw an error if user is not owner', async () => {
			const req = createRequest();
			req.user = {
				id: authorId,
				role: UserRole.AUTHOR,
			} as JwtSignPayload;

			await expect(controller.delete(id2, req)).rejects.toEqual(
				new ForbiddenException(FORBIDDEN_EXCEPTION)
			);
		});

		it('should throw an error if book does not exists', async () => {
			const req = createRequest();
			req.user = {
				id: authorId,
				role: UserRole.AUTHOR,
			} as JwtSignPayload;

			const id = 'testid';
			await expect(controller.delete(id, req)).rejects.toEqual(
				new NotFoundException(`Book with identifier ${id} not found`)
			);
		});
	});
});
