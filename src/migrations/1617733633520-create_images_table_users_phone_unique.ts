import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateImagesTableUsersPhoneUnique1617733633520
    implements MigrationInterface {
    name = 'createImagesTableUsersPhoneUnique1617733633520';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('COMMENT ON COLUMN "users"."phone" IS NULL');
        await queryRunner.query(
            'ALTER TABLE "users" DROP CONSTRAINT "UQ_a000cca60bcf04454e727699490"',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "users" ADD CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone")',
        );
        await queryRunner.query('COMMENT ON COLUMN "users"."phone" IS NULL');
    }
}
