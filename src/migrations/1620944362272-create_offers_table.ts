import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOffersTable1620944362272 implements MigrationInterface {
    name = 'createOffersTable1620944362272';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "CREATE TYPE \"offers_status_enum\" AS ENUM('ACTIVE', 'INACTIVE', 'EXPIRED', 'DELETED')",
        );
        await queryRunner.query(
            'CREATE SEQUENCE offer_reference_sequence START WITH 1000 INCREMENT BY 1 MAXVALUE 2147483647 MINVALUE 1;',
        );
        await queryRunner.query(
            `CREATE TABLE "offers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(),
             "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "reference" integer NOT NULL DEFAULT nextval('store_reference_sequence'), 
             "title" character varying, "description" character varying NOT NULL, "price" numeric, "price_currency" character varying(3) 
              NOT NULL DEFAULT 'SAR', "status" "offers_status_enum" NOT NULL DEFAULT 'ACTIVE', "request_id" uuid,
               "owner_id" uuid, "store_id" uuid, CONSTRAINT "PK_4c88e956195bba85977da21b8f4" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query('ALTER TABLE "images" ADD "offer_id" uuid');
        await queryRunner.query(
            `ALTER TABLE "offers" ADD CONSTRAINT "FK_a95e1929b6cdc91ec744b5dce3c" FOREIGN KEY ("request_id") 
            REFERENCES "requests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "offers" ADD CONSTRAINT "FK_e1e2232f2458ed1b0bb6bdb6ba1" FOREIGN KEY ("owner_id") 
            REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "offers" ADD CONSTRAINT "FK_4c6cfeca870f1e05552144e4fae" FOREIGN KEY ("store_id")
             REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "images" ADD CONSTRAINT "FK_0c928bb5b78b0126c1cd76772d1" FOREIGN KEY ("offer_id") 
            REFERENCES "offers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "images" DROP CONSTRAINT "FK_0c928bb5b78b0126c1cd76772d1"',
        );
        await queryRunner.query(
            'ALTER TABLE "offers" DROP CONSTRAINT "FK_4c6cfeca870f1e05552144e4fae"',
        );
        await queryRunner.query(
            'ALTER TABLE "offers" DROP CONSTRAINT "FK_e1e2232f2458ed1b0bb6bdb6ba1"',
        );
        await queryRunner.query(
            'ALTER TABLE "offers" DROP CONSTRAINT "FK_a95e1929b6cdc91ec744b5dce3c"',
        );
        await queryRunner.query('ALTER TABLE "images" DROP COLUMN "offer_id"');
        await queryRunner.query('DROP TABLE "offers"');
        await queryRunner.query('DROP SEQUENCE offer_reference_sequence');
        await queryRunner.query('DROP TYPE "offers_status_enum"');
    }
}
