import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterOfferRejectContent1621105006299
    implements MigrationInterface {
    name = 'alterOfferRejectContent1621105006299';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TYPE "offers_reject_code_enum" AS ENUM(\'TOO_HIGH\')',
        );
        await queryRunner.query(
            'ALTER TABLE "offers" ADD "reject_code" "offers_reject_code_enum"',
        );
        await queryRunner.query(
            'ALTER TABLE "offers" ADD "reject_message" character varying',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "offers" DROP COLUMN "reject_message"',
        );
        await queryRunner.query(
            'ALTER TABLE "offers" DROP COLUMN "reject_code"',
        );
        await queryRunner.query('DROP TYPE "offers_reject_code_enum"');
    }
}
