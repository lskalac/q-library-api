import { Column, Entity } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Book extends BaseEntity {
    @Column('varchar', {
        length: 150,
        nullable: false
    })
    title: string;

    @Column('varchar', {
        length: 150,
        nullable: false
    })
    publisher: string;

    @Column('date', {
        nullable: false
    })
    publishedDate: Date;

    @Column('int', {
        nullable: false
    })
    numberOfPages: number;

    @Column('int', {
        nullable: false
    })
    isbn: number;
}