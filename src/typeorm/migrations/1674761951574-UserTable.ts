import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class UserTable1674761951574 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'user',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'uuid',
					},
					{
						name: 'firstName',
						type: 'varchar(150)',
						isNullable: false,
					},
					{
						name: 'lastName',
						type: 'varchar(150)',
						isNullable: false,
					},
					{
						name: 'email',
						type: 'varchar',
						isNullable: false,
						isUnique: true,
					},
					{
						name: 'passwordHash',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'phone',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'role',
						type: 'enum',
						enum: ['admin', 'author'],
						isNullable: false,
					},
				],
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		queryRunner.dropTable('DROP TABLE user');
	}
}
