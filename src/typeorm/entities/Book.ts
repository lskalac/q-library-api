import {Column, Entity, ManyToOne} from 'typeorm';
import { User } from '.';
import {BaseEntity} from './BaseEntity';

@Entity({
	orderBy: {
		title: 'ASC',
		datePublished: 'DESC',
	},
})
export class Book extends BaseEntity {
	@Column('varchar', {
		length: 150,
		nullable: false,
	})
	title: string;

	@Column('varchar', {
		length: 150,
		nullable: false,
	})
	publisher: string;

	@Column('date', {
		nullable: false,
	})
	publishedDate: Date;

	@Column('int', {
		nullable: false,
	})
	numberOfPages: number;

	@Column('int', {
		nullable: false,
		unique: true
	})
	isbn: number;

	@Column('uuid', {
		nullable: false
	})
	authorId: string;

	@ManyToOne(() => User)
	author: User;
}
