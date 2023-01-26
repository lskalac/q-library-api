import {MigrationInterface, QueryRunner, TableColumn} from 'typeorm';

export class UserIsActiveColumn1674772879283 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			'user',
			new TableColumn({
				name: 'isActive',
				type: 'boolean',
				isNullable: false,
				default: true,
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn('user', 'isActive');
	}
}
