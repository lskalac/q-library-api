import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class BookTable1674668071268 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'book',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'uuid',
					},
					{
						name: 'title',
						type: 'varchar(150)',
						isNullable: false,
					},
					{
						name: 'publisher',
						type: 'varchar(150)',
						isNullable: false,
					},
					{
						name: 'publishedDate',
						type: 'date',
						isNullable: false,
					},
					{
						name: 'numberOfPages',
						type: 'int',
						isNullable: false,
					},
					{
						name: 'isbn',
						type: 'int',
						isNullable: false,
					},
				],
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		queryRunner.query('DROP TABLE book');
	}
}
