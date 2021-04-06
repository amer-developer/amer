import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateImagesTable1617732953031 implements MigrationInterface {
    name = 'createImagesTable1617732953031';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "CREATE TYPE \"images_folder_enum\" AS ENUM('PROFILE', 'POST', 'OFFER')",
        );
        await queryRunner.query(
            `CREATE TABLE "images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(),
             "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "folder" "images_folder_enum",
              "url" character varying NOT NULL, CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "images"');
        await queryRunner.query('DROP TYPE "images_folder_enum"');
    }
}
