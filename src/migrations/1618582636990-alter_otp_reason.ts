import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterOtpReason1618582636990 implements MigrationInterface {
    name = 'alterOtpReason1618582636990';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TYPE "public"."otp_reason_enum" RENAME TO "otp_reason_enum_old"',
        );
        await queryRunner.query(
            "CREATE TYPE \"otp_reason_enum\" AS ENUM('REGISTER', 'RESET_PASSWORD')",
        );
        await queryRunner.query(
            'ALTER TABLE "otp" ALTER COLUMN "reason" TYPE "otp_reason_enum" USING "reason"::"text"::"otp_reason_enum"',
        );
        await queryRunner.query('DROP TYPE "otp_reason_enum_old"');
        await queryRunner.query('COMMENT ON COLUMN "otp"."reason" IS NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('COMMENT ON COLUMN "otp"."reason" IS NULL');
        await queryRunner.query(
            'CREATE TYPE "otp_reason_enum_old" AS ENUM(\'REGISTER\')',
        );
        await queryRunner.query(
            'ALTER TABLE "otp" ALTER COLUMN "reason" TYPE "otp_reason_enum_old" USING "reason"::"text"::"otp_reason_enum_old"',
        );
        await queryRunner.query('DROP TYPE "otp_reason_enum"');
        await queryRunner.query(
            'ALTER TYPE "otp_reason_enum_old" RENAME TO  "otp_reason_enum"',
        );
    }
}
