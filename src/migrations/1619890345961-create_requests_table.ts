import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRequestsTable1619890345961 implements MigrationInterface {
    name = 'createRequestsTable1619890345961';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "sub_categories" DROP CONSTRAINT "FK_5fdeaec083b0032b77b7d5a201d"',
        );
        await queryRunner.query(
            "CREATE TYPE \"requests_status_enum\" AS ENUM('ACTIVE', 'INACTIVE', 'EXPIRED', 'DELETED')",
        );
        await queryRunner.query(
            `CREATE TABLE "requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(),
             "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying,
             "budget_min" numeric, "budget_max" integer, "budget_currency" character varying NOT NULL DEFAULT 'SAR',
             "status" "requests_status_enum" NOT NULL DEFAULT 'INACTIVE', "category_id" uuid, "sub_category_id" uuid,
             "location_id" uuid, "owner_id" uuid, CONSTRAINT "REL_369d2523b6e48eb1246f825eab" UNIQUE ("location_id"),
             CONSTRAINT "PK_0428f484e96f9e6a55955f29b5f" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query('ALTER TABLE "images" ADD "request_id" uuid');
        await queryRunner.query(
            'ALTER TYPE "public"."images_folder_enum" RENAME TO "images_folder_enum_old"',
        );
        await queryRunner.query(
            "CREATE TYPE \"images_folder_enum\" AS ENUM('PROFILE', 'REQUEST', 'OFFER')",
        );
        await queryRunner.query(
            'ALTER TABLE "images" ALTER COLUMN "folder" TYPE "images_folder_enum" USING "folder"::"text"::"images_folder_enum"',
        );
        await queryRunner.query('DROP TYPE "images_folder_enum_old"');
        await queryRunner.query('COMMENT ON COLUMN "images"."folder" IS NULL');
        await queryRunner.query(
            `ALTER TABLE "sub_categories" ADD CONSTRAINT "FK_7a424f07f46010d3441442f7764" FOREIGN KEY ("category_id")
             REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "images" ADD CONSTRAINT "FK_3829ef886b6fb957045bd062802" FOREIGN KEY ("request_id") REFERENCES 
            "requests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "requests" ADD CONSTRAINT "FK_fe7f7a72de26bcefaa0344f7b4a" FOREIGN KEY ("category_id") REFERENCES 
            "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "requests" ADD CONSTRAINT "FK_ee4826732542cacde90b5a3e420" FOREIGN KEY ("sub_category_id") 
            REFERENCES "sub_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "requests" ADD CONSTRAINT "FK_369d2523b6e48eb1246f825eab1" FOREIGN KEY ("location_id") REFERENCES 
            "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "requests" ADD CONSTRAINT "FK_6188acb1c47a8e58b7058293642" FOREIGN KEY ("owner_id") REFERENCES 
            "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "requests" DROP CONSTRAINT "FK_6188acb1c47a8e58b7058293642"',
        );
        await queryRunner.query(
            'ALTER TABLE "requests" DROP CONSTRAINT "FK_369d2523b6e48eb1246f825eab1"',
        );
        await queryRunner.query(
            'ALTER TABLE "requests" DROP CONSTRAINT "FK_ee4826732542cacde90b5a3e420"',
        );
        await queryRunner.query(
            'ALTER TABLE "requests" DROP CONSTRAINT "FK_fe7f7a72de26bcefaa0344f7b4a"',
        );
        await queryRunner.query(
            'ALTER TABLE "images" DROP CONSTRAINT "FK_3829ef886b6fb957045bd062802"',
        );
        await queryRunner.query(
            'ALTER TABLE "sub_categories" DROP CONSTRAINT "FK_7a424f07f46010d3441442f7764"',
        );
        await queryRunner.query('COMMENT ON COLUMN "images"."folder" IS NULL');
        await queryRunner.query(
            "CREATE TYPE \"images_folder_enum_old\" AS ENUM('PROFILE', 'POST', 'OFFER')",
        );
        await queryRunner.query(
            'ALTER TABLE "images" ALTER COLUMN "folder" TYPE "images_folder_enum_old" USING "folder"::"text"::"images_folder_enum_old"',
        );
        await queryRunner.query('DROP TYPE "images_folder_enum"');
        await queryRunner.query(
            'ALTER TYPE "images_folder_enum_old" RENAME TO  "images_folder_enum"',
        );
        await queryRunner.query(
            'ALTER TABLE "images" DROP COLUMN "request_id"',
        );
        await queryRunner.query('DROP TABLE "requests"');
        await queryRunner.query('DROP TYPE "requests_status_enum"');
        await queryRunner.query(
            `ALTER TABLE "sub_categories" ADD CONSTRAINT "FK_5fdeaec083b0032b77b7d5a201d" FOREIGN KEY ("category_id") REFERENCES
             "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
