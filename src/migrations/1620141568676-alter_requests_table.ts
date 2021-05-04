import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterRequestsTable1620141568676 implements MigrationInterface {
    name = 'alterRequestsTable1620141568676';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "requests" DROP COLUMN "budget_currency"',
        );
        await queryRunner.query(
            'ALTER TABLE "requests" ADD "budget_currency" character varying(3) NOT NULL DEFAULT \'SAR\'',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "requests" DROP COLUMN "budget_currency"',
        );
        await queryRunner.query(
            'ALTER TABLE "requests" ADD "budget_currency" character varying NOT NULL DEFAULT \'SAR\'',
        );
    }
}
