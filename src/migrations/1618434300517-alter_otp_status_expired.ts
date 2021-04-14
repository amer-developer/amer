import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterOtpStatusExpired1618434300517 implements MigrationInterface {
    name = 'alterOtpStatusExpired1618434300517';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TYPE "public"."otp_status_enum" RENAME TO "otp_status_enum_old"',
        );
        await queryRunner.query(
            "CREATE TYPE \"otp_status_enum\" AS ENUM('SENT', 'VERIFIED', 'INVALID', 'EXPIRED', 'TERMINATED')",
        );
        await queryRunner.query(
            'ALTER TABLE "otp" ALTER COLUMN "status" TYPE "otp_status_enum" USING "status"::"text"::"otp_status_enum"',
        );
        await queryRunner.query('DROP TYPE "otp_status_enum_old"');
        await queryRunner.query('COMMENT ON COLUMN "otp"."status" IS NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('COMMENT ON COLUMN "otp"."status" IS NULL');
        await queryRunner.query(
            "CREATE TYPE \"otp_status_enum_old\" AS ENUM('SENT', 'VERIFIED', 'INVALID', 'TERMINATED')",
        );
        await queryRunner.query(
            'ALTER TABLE "otp" ALTER COLUMN "status" TYPE "otp_status_enum_old" USING "status"::"text"::"otp_status_enum_old"',
        );
        await queryRunner.query('DROP TYPE "otp_status_enum"');
        await queryRunner.query(
            'ALTER TYPE "otp_status_enum_old" RENAME TO  "otp_status_enum"',
        );
    }
}
