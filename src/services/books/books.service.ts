import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDto } from 'src/dtos/books/CreateBook.dto';
import { Book } from 'src/typeorm/entities';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
    constructor(@InjectRepository(Book) private bookRepository: Repository<Book>){
    }

    get(): Promise<Book[]>{
        return this.bookRepository.find();
    }

    getById(id: string): Promise<Book>{
        return this.bookRepository.findOneBy({id});
    }

    create(book: CreateBookDto): Promise<Book>{
        const entity = this.bookRepository.create(book);
        return this.bookRepository.save(entity);
    }

    async update(id: string, book: CreateBookDto): Promise<boolean>{
        return (await this.bookRepository.update({id}, book)).affected === 1;
    }
}
