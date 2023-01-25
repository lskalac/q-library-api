import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}
