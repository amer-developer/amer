import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCategoriesAddIcon1621087990140 implements MigrationInterface {
    name = 'alterCategoriesAddIcon1621087990140';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "categories" ADD "background_color" character varying',
        );
        await queryRunner.query(
            'ALTER TABLE "categories" ADD "text_color" character varying',
        );
        await queryRunner.query('ALTER TABLE "categories" ADD "icon_id" uuid');
        await queryRunner.query(
            'ALTER TABLE "categories" ADD CONSTRAINT "UQ_1eff0de0a3d9e41ef91f9051cc1" UNIQUE ("icon_id")',
        );
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_1eff0de0a3d9e41ef91f9051cc1" FOREIGN KEY ("icon_id") 
								REFERENCES "images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "categories" DROP CONSTRAINT "FK_1eff0de0a3d9e41ef91f9051cc1"',
        );
        await queryRunner.query(
            'ALTER TABLE "categories" DROP CONSTRAINT "UQ_1eff0de0a3d9e41ef91f9051cc1"',
        );
        await queryRunner.query(
            'ALTER TABLE "categories" DROP COLUMN "icon_id"',
        );
        await queryRunner.query(
            'ALTER TABLE "categories" DROP COLUMN "text_color"',
        );
        await queryRunner.query(
            'ALTER TABLE "categories" DROP COLUMN "background_color"',
        );
    }
}
