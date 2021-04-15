import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSmsTable1618511482892 implements MigrationInterface {
    name = 'createSmsTable1618511482892';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "CREATE TYPE \"sms_status_enum\" AS ENUM('INITIATED', 'SENT', 'FAILED')",
        );
        await queryRunner.query(
            `CREATE TABLE "sms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(),
             "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "body" character varying NOT NULL,
              "status" "sms_status_enum" NOT NULL DEFAULT 'INITIATED', "phone" character varying NOT NULL,
               CONSTRAINT "PK_60793c2f16aafe0513f8817eae8" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "sms"');
        await queryRunner.query('DROP TYPE "sms_status_enum"');
    }
}
