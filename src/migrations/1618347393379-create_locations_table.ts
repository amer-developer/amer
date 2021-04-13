import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLocationsTable1618347393379 implements MigrationInterface {
    name = 'createLocationsTable1618347393379';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "locations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(),
         "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          "address1" character varying NOT NULL, "address2" character varying NOT NULL, "city_id" uuid,
           "country_id" uuid, "district_id" uuid, CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`);
        await queryRunner.query('ALTER TABLE "users" ADD "location_id" uuid');
        await queryRunner.query(
            'ALTER TABLE "users" ADD CONSTRAINT "UQ_1523fb2aebce55b9e820122ee0e" UNIQUE ("location_id")',
        );
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_1523fb2aebce55b9e820122ee0e" 
        FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "locations" ADD CONSTRAINT "FK_6793ebdac5c08faf9f8d48a2b99" 
        FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "locations" ADD CONSTRAINT "FK_e70736d3cab84632af5f1811d35" 
        FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "locations" ADD CONSTRAINT "FK_70d753bf79185710413df7e22b2" 
        FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "locations" DROP CONSTRAINT "FK_70d753bf79185710413df7e22b2"',
        );
        await queryRunner.query(
            'ALTER TABLE "locations" DROP CONSTRAINT "FK_e70736d3cab84632af5f1811d35"',
        );
        await queryRunner.query(
            'ALTER TABLE "locations" DROP CONSTRAINT "FK_6793ebdac5c08faf9f8d48a2b99"',
        );
        await queryRunner.query(
            'ALTER TABLE "users" DROP CONSTRAINT "FK_1523fb2aebce55b9e820122ee0e"',
        );
        await queryRunner.query(
            'ALTER TABLE "users" DROP CONSTRAINT "UQ_1523fb2aebce55b9e820122ee0e"',
        );
        await queryRunner.query(
            'ALTER TABLE "users" DROP COLUMN "location_id"',
        );
        await queryRunner.query('DROP TABLE "locations"');
    }
}
