import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Post, Put } from '@nestjs/common';
import { BooksService } from 'src/services/books/books.service';
import { Book } from 'src/typeorm/entities';
import {ApiTags, ApiOkResponse, ApiCreatedResponse} from '@nestjs/swagger';
import { BookDto } from 'src/dtos/books/Book.dto';
import { CreateBookDto } from 'src/dtos/books/CreateBook.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
    constructor(private bookService: BooksService){
    }

    @Get()
    @ApiOkResponse({ isArray: true, type: BookDto, description: 'Requested books'})
    get(): Promise<Book[]>{
        return this.bookService.get();
    }

    @Get(':id')
    @ApiOkResponse({type: BookDto, description: 'Requested book'})
    getById(@Param('id') id: string): Promise<Book>{
        return this.bookService.getById(id);
    }

    @Post()
    @ApiCreatedResponse({type: BookDto, description: 'Book successfully created'})
    create(@Body() book: CreateBookDto): Promise<Book>{
        return this.bookService.create(book);
    }

    @Put(':id')
    @ApiOkResponse({description: 'Book sucessfully updated'})
    async update(@Param('id') id: string, @Body() book: CreateBookDto): Promise<void>{
        const result = await this.bookService.update(id, book);
        if(!result)
            throw new InternalServerErrorException();
        
        return;
    }

    @Delete(':id')
    @ApiOkResponse({description: 'Book sucessfully deleted'})
    async delete(@Param('id') id: string): Promise<void>{
        const result = await this.bookService.delete(id);
        if(!result)
            throw new InternalServerErrorException();

        return;
    }
}
 