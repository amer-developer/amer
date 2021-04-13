import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDistrictsTable1618344518414 implements MigrationInterface {
    name = 'createDistrictsTable1618344518414';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "districts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(),
             "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
              "name_ar" character varying NOT NULL, "name_en" character varying NOT NULL, "city_id" uuid,
               CONSTRAINT "PK_972a72ff4e3bea5c7f43a2b98af" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "districts" ADD CONSTRAINT "FK_d7d1704cfb8bc19fb0d9c2f7ced" FOREIGN KEY ("city_id")
             REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "districts" DROP CONSTRAINT "FK_d7d1704cfb8bc19fb0d9c2f7ced"',
        );
        await queryRunner.query('DROP TABLE "districts"');
    }
}
