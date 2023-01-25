import { Controller, Get, Param } from '@nestjs/common';
import { BooksService } from 'src/services/books/books.service';
import { Book } from 'src/typeorm/entities';

@Controller('books')
export class BooksController {
    constructor(private bookService: BooksService){
    }

    @Get()
    get(): Promise<Book[]>{
        return this.bookService.get();
    }

    @Get(':id')
    getById(@Param('id') id: string): Promise<Book>{
        return this.bookService.getById(id);
    }
}
