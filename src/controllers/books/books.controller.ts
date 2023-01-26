import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { BooksService } from 'src/services/books/books.service';
import { Book } from 'src/typeorm/entities';
import {ApiTags, ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse} from '@nestjs/swagger';
import { BookDto } from 'src/dtos/books/Book.dto';
import { CreateBookDto } from 'src/dtos/books/CreateBook.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
    constructor(private bookService: BooksService){
    }

    @Get()
    @ApiOkResponse({ isArray: true, type: BookDto, description: 'Requested books'})
    get(): Promise<BookDto[]>{
        return this.bookService.get();
    }

    @Get(':id')
    @ApiOkResponse({type: BookDto, description: 'Requested book'})
    getById(@Param('id') id: string): Promise<BookDto>{
        return this.bookService.getById(id);
    }

    @Post()
    @ApiCreatedResponse({type: BookDto, description: 'Book successfully created'})
    create(@Body() book: CreateBookDto): Promise<BookDto>{
        return this.bookService.create(book);
    }

    @Put(':id')
    @ApiOkResponse({description: 'Book sucessfully updated'})
    @ApiNotFoundResponse({description: 'Requested book not found'})
    async update(@Param('id') id: string, @Body() book: CreateBookDto): Promise<void>{
        await this.checkBookExistance(id);

        const result = await this.bookService.update(id, book);
        if(!result)
            throw new InternalServerErrorException();
        
        return;
    }

    @Delete(':id')
    @ApiOkResponse({description: 'Book sucessfully deleted'})
    @ApiNotFoundResponse({description: 'Requested book not found'})
    async delete(@Param('id') id: string): Promise<void>{
        await this.checkBookExistance(id);

        const result = await this.bookService.delete(id);
        if(!result)
            throw new InternalServerErrorException();

        return;
    }

    private async checkBookExistance(id: string): Promise<void>{
        const existingBook = await this.bookService.getById(id);
        if(!existingBook)
            throw new NotFoundException(`Book with identifier ${id} not found`);
    }
}
 