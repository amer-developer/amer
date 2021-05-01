import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategorySubCategoryTables1619832950909
    implements MigrationInterface {
    name = 'createCategorySubCategoryTables1619832950909';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "CREATE TYPE \"sub_categories_status_enum\" AS ENUM('ACTIVE', 'INACTIVE', 'DELETED')",
        );
        await queryRunner.query(
            `CREATE TABLE "sub_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
             "name_ar" character varying NOT NULL, "name_en" character varying NOT NULL,
              "status" "sub_categories_status_enum" NOT NULL DEFAULT 'INACTIVE', "category_id" uuid,
               CONSTRAINT "PK_d22319d65c44efc1d19c4a08989" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            "CREATE TYPE \"categories_status_enum\" AS ENUM('ACTIVE', 'INACTIVE', 'DELETED')",
        );
        await queryRunner.query(
            `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(),
             "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name_ar" character varying NOT NULL, "name_en" character varying NOT NULL,
              "status" "categories_status_enum" NOT NULL DEFAULT 'INACTIVE', CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "sub_categories" ADD CONSTRAINT "FK_5fdeaec083b0032b77b7d5a201d" FOREIGN KEY
             ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "sub_categories" DROP CONSTRAINT "FK_5fdeaec083b0032b77b7d5a201d"',
        );
        await queryRunner.query('DROP TABLE "categories"');
        await queryRunner.query('DROP TYPE "categories_status_enum"');
        await queryRunner.query('DROP TABLE "sub_categories"');
        await queryRunner.query('DROP TYPE "sub_categories_status_enum"');
    }
}
