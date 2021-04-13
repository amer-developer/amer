import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterLocationsTable1618350469463 implements MigrationInterface {
    name = 'alterLocationsTable1618350469463';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "locations" ALTER COLUMN "address1" DROP NOT NULL',
        );
        await queryRunner.query(
            'COMMENT ON COLUMN "locations"."address1" IS NULL',
        );
        await queryRunner.query(
            'ALTER TABLE "locations" ALTER COLUMN "address2" DROP NOT NULL',
        );
        await queryRunner.query(
            'COMMENT ON COLUMN "locations"."address2" IS NULL',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'COMMENT ON COLUMN "locations"."address2" IS NULL',
        );
        await queryRunner.query(
            'ALTER TABLE "locations" ALTER COLUMN "address2" SET NOT NULL',
        );
        await queryRunner.query(
            'COMMENT ON COLUMN "locations"."address1" IS NULL',
        );
        await queryRunner.query(
            'ALTER TABLE "locations" ALTER COLUMN "address1" SET NOT NULL',
        );
    }
}
