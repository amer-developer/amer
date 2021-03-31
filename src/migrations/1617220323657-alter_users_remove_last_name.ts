import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUsersRemoveLastName1617220323657
    implements MigrationInterface {
    name = 'alterUsersRemoveLastName1617220323657';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "users" DROP COLUMN "first_name"');
        await queryRunner.query('ALTER TABLE "users" DROP COLUMN "last_name"');
        await queryRunner.query(
            'ALTER TABLE "users" ADD "name" character varying',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "users" DROP COLUMN "name"');
        await queryRunner.query(
            'ALTER TABLE "users" ADD "last_name" character varying',
        );
        await queryRunner.query(
            'ALTER TABLE "users" ADD "first_name" character varying',
        );
    }
}
