import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCountriesTableNullable1617269478886
    implements MigrationInterface {
    name = 'alterCountriesTableNullable1617269478886';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "countries" ALTER COLUMN "code" SET NOT NULL',
        );
        await queryRunner.query('COMMENT ON COLUMN "countries"."code" IS NULL');
        await queryRunner.query(
            'ALTER TABLE "countries" ALTER COLUMN "name_ar" SET NOT NULL',
        );
        await queryRunner.query(
            'COMMENT ON COLUMN "countries"."name_ar" IS NULL',
        );
        await queryRunner.query(
            'ALTER TABLE "countries" ALTER COLUMN "name_en" SET NOT NULL',
        );
        await queryRunner.query(
            'COMMENT ON COLUMN "countries"."name_en" IS NULL',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'COMMENT ON COLUMN "countries"."name_en" IS NULL',
        );
        await queryRunner.query(
            'ALTER TABLE "countries" ALTER COLUMN "name_en" DROP NOT NULL',
        );
        await queryRunner.query(
            'COMMENT ON COLUMN "countries"."name_ar" IS NULL',
        );
        await queryRunner.query(
            'ALTER TABLE "countries" ALTER COLUMN "name_ar" DROP NOT NULL',
        );
        await queryRunner.query('COMMENT ON COLUMN "countries"."code" IS NULL');
        await queryRunner.query(
            'ALTER TABLE "countries" ALTER COLUMN "code" DROP NOT NULL',
        );
    }
}
