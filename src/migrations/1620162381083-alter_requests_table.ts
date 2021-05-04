import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterRequestsTable1620162381083 implements MigrationInterface {
    name = 'alterRequestsTable1620162381083';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "requests" DROP COLUMN "budget_max"',
        );
        await queryRunner.query(
            'ALTER TABLE "requests" ADD "budget_max" numeric',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "requests" DROP COLUMN "budget_max"',
        );
        await queryRunner.query(
            'ALTER TABLE "requests" ADD "budget_max" integer',
        );
    }
}
