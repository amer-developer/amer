import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateImagesTableNameNullable1617733252276
    implements MigrationInterface {
    name = 'createImagesTableNameNullable1617733252276';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "images" ALTER COLUMN "name" DROP NOT NULL',
        );
        await queryRunner.query('COMMENT ON COLUMN "images"."name" IS NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('COMMENT ON COLUMN "images"."name" IS NULL');
        await queryRunner.query(
            'ALTER TABLE "images" ALTER COLUMN "name" SET NOT NULL',
        );
    }
}
