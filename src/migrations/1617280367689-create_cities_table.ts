import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCitiesTable1617280367689 implements MigrationInterface {
    name = 'createCitiesTable1617280367689';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "cities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
             "name_ar" character varying NOT NULL, "name_en" character varying NOT NULL, "country_id" uuid,
              CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL',
        );
        await queryRunner.query('COMMENT ON COLUMN "users"."name" IS NULL');
        await queryRunner.query(
            `ALTER TABLE "cities" ADD CONSTRAINT "FK_4aa0d9a52c36ff93415934e2d2b" FOREIGN KEY ("country_id")
             REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "cities" DROP CONSTRAINT "FK_4aa0d9a52c36ff93415934e2d2b"',
        );
        await queryRunner.query('COMMENT ON COLUMN "users"."name" IS NULL');
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL',
        );
        await queryRunner.query('DROP TABLE "cities"');
    }
}
