import { MigrationInterface, QueryRunner } from 'typeorm';

export class CretaeCountriesTable1617222434955 implements MigrationInterface {
    name = 'cretaeCountriesTable1617222434955';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "countries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(),
             "created_at" TIMESTAMP NOT NULL DEFAULT now(),
              "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
               "code" character varying, "name_ar" character varying,
                "name_en" character varying, CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "countries"');
    }
}
