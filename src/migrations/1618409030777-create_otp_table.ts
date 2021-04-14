import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOtpTable1618409030777 implements MigrationInterface {
    name = 'createOtpTable1618409030777';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TYPE "otp_reason_enum" AS ENUM(\'REGISTER\')',
        );
        await queryRunner.query(
            "CREATE TYPE \"otp_status_enum\" AS ENUM('SENT', 'VERIFIED', 'INVALID', 'TERMINATED')",
        );
        await queryRunner.query(
            `CREATE TABLE "otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
             "code" character varying NOT NULL, "reason" "otp_reason_enum", 
             "attempt" integer NOT NULL DEFAULT '0', "retry" integer NOT NULL DEFAULT '0',
              "status" "otp_status_enum" NOT NULL, "phone" character varying NOT NULL,
               CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "otp"');
        await queryRunner.query('DROP TYPE "otp_status_enum"');
        await queryRunner.query('DROP TYPE "otp_reason_enum"');
    }
}
