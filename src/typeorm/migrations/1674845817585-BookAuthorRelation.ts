import {
	MigrationInterface,
	QueryRunner,
	TableColumn,
	TableForeignKey,
} from 'typeorm';

export class BookAuthorRelation1674845817585 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			'book',
			new TableColumn({
				name: 'authorId',
				type: 'uuid',
				isNullable: false,
			})
		);

		await queryRunner.createForeignKey(
			'book',
			new TableForeignKey({
				columnNames: ['authorId'],
				referencedColumnNames: ['id'],
				referencedTableName: 'user',
				onDelete: 'CASCADE',
				name: 'FK_Book_Author_AuthorId',
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropForeignKey('book', 'FK_Book_Author_AuthorId');
		await queryRunner.dropColumn('book', 'authorId');
	}
}
