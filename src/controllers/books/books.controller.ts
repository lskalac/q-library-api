import { Controller, Get, Param } from '@nestjs/common';
import { BooksService } from 'src/services/books/books.service';
import { Book } from 'src/typeorm/entities';
import {ApiTags, ApiOkResponse} from '@nestjs/swagger';
import { BookDto } from 'src/dtos/Book.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
    constructor(private bookService: BooksService){
    }

    @Get()
    @ApiOkResponse({ isArray: true, type: BookDto})
    get(): Promise<Book[]>{
        return this.bookService.get();
    }

    @Get(':id')
    @ApiOkResponse({type: BookDto})
    getById(@Param('id') id: string): Promise<Book>{
        return this.bookService.getById(id);
    }
}
