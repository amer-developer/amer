/* eslint-disable */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class createStoresTable1620332939820 implements MigrationInterface {
    name = 'createStoresTable1620332939820';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "CREATE TYPE \"stores_status_enum\" AS ENUM('ACTIVE', 'INACTIVE', 'DELETED')",
        );
        await queryRunner.query(
            'CREATE SEQUENCE store_number_sequence START WITH 1 INCREMENT BY 1 MAXVALUE 2147483647 MINVALUE 1;',
        );
        await queryRunner.query(
            'CREATE TABLE "stores" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "store_number" integer NOT NULL DEFAULT nextval(\'store_number_sequence\'), "name" character varying NOT NULL,  "avatar" character varying, "bio" character varying, "status" "stores_status_enum" NOT NULL DEFAULT \'INACTIVE\', "category_id" uuid, "sub_category_id" uuid, "location_id" uuid, CONSTRAINT "REL_63adcb0fb5f55a15434453e80a" UNIQUE ("location_id"), CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))',
        );
        await queryRunner.query('ALTER TABLE "users" ADD "store_id" uuid');
        await queryRunner.query(
            'ALTER TABLE "stores" ADD CONSTRAINT "FK_40abd374d12d7b19c471aa156cd" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
        await queryRunner.query(
            'ALTER TABLE "stores" ADD CONSTRAINT "FK_cf3a47e4d75013f0c8a4b488633" FOREIGN KEY ("sub_category_id") REFERENCES "sub_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
        await queryRunner.query(
            'ALTER TABLE "stores" ADD CONSTRAINT "FK_63adcb0fb5f55a15434453e80aa" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
        await queryRunner.query(
            'ALTER TABLE "users" ADD CONSTRAINT "FK_98a52595c9031d60f5c8d280ca4" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "users" DROP CONSTRAINT "FK_98a52595c9031d60f5c8d280ca4"',
        );
        await queryRunner.query(
            'ALTER TABLE "stores" DROP CONSTRAINT "FK_63adcb0fb5f55a15434453e80aa"',
        );
        await queryRunner.query(
            'ALTER TABLE "stores" DROP CONSTRAINT "FK_cf3a47e4d75013f0c8a4b488633"',
        );
        await queryRunner.query(
            'ALTER TABLE "stores" DROP CONSTRAINT "FK_40abd374d12d7b19c471aa156cd"',
        );
        await queryRunner.query('ALTER TABLE "users" DROP COLUMN "store_id"');
        await queryRunner.query('DROP TABLE "stores"');
        await queryRunner.query('DROP SEQUENCE store_number_sequence');
        await queryRunner.query('DROP TYPE "stores_status_enum"');
    }
}
