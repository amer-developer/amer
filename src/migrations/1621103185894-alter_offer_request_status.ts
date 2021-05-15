import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterOfferRequestStatus1621103185894
    implements MigrationInterface {
    name = 'alterOfferRequestStatus1621103185894';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TYPE "public"."requests_status_enum" RENAME TO "requests_status_enum_old"',
        );
        await queryRunner.query(
            "CREATE TYPE \"requests_status_enum\" AS ENUM('ACTIVE', 'INACTIVE', 'EXPIRED', 'DELETED', 'ACCEPTED_COMPLETED')",
        );
        await queryRunner.query(
            'ALTER TABLE "requests" ALTER COLUMN "status" DROP DEFAULT',
        );
        await queryRunner.query(
            'ALTER TABLE "requests" ALTER COLUMN "status" TYPE "requests_status_enum" USING "status"::"text"::"requests_status_enum"',
        );
        await queryRunner.query(
            'ALTER TABLE "requests" ALTER COLUMN "status" SET DEFAULT \'ACTIVE\'',
        );
        await queryRunner.query('DROP TYPE "requests_status_enum_old"');
        await queryRunner.query(
            'COMMENT ON COLUMN "requests"."status" IS NULL',
        );
        await queryRunner.query(
            'ALTER TYPE "public"."offers_status_enum" RENAME TO "offers_status_enum_old"',
        );
        await queryRunner.query(
            "CREATE TYPE \"offers_status_enum\" AS ENUM('ACTIVE', 'INACTIVE', 'EXPIRED', 'DELETED', 'ACCEPTED', 'REJECTED')",
        );
        await queryRunner.query(
            'ALTER TABLE "offers" ALTER COLUMN "status" DROP DEFAULT',
        );
        await queryRunner.query(
            'ALTER TABLE "offers" ALTER COLUMN "status" TYPE "offers_status_enum" USING "status"::"text"::"offers_status_enum"',
        );
        await queryRunner.query(
            'ALTER TABLE "offers" ALTER COLUMN "status" SET DEFAULT \'ACTIVE\'',
        );
        await queryRunner.query('DROP TYPE "offers_status_enum_old"');
        await queryRunner.query('COMMENT ON COLUMN "offers"."status" IS NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('COMMENT ON COLUMN "offers"."status" IS NULL');
        await queryRunner.query(
            "CREATE TYPE \"offers_status_enum_old\" AS ENUM('ACTIVE', 'INACTIVE', 'EXPIRED', 'DELETED')",
        );
        await queryRunner.query(
            'ALTER TABLE "offers" ALTER COLUMN "status" DROP DEFAULT',
        );
        await queryRunner.query(
            'ALTER TABLE "offers" ALTER COLUMN "status" TYPE "offers_status_enum_old" USING "status"::"text"::"offers_status_enum_old"',
        );
        await queryRunner.query(
            'ALTER TABLE "offers" ALTER COLUMN "status" SET DEFAULT \'ACTIVE\'',
        );
        await queryRunner.query('DROP TYPE "offers_status_enum"');
        await queryRunner.query(
            'ALTER TYPE "offers_status_enum_old" RENAME TO  "offers_status_enum"',
        );
        await queryRunner.query(
            'COMMENT ON COLUMN "requests"."status" IS NULL',
        );
        await queryRunner.query(
            "CREATE TYPE \"requests_status_enum_old\" AS ENUM('ACTIVE', 'INACTIVE', 'EXPIRED', 'DELETED')",
        );
        await queryRunner.query(
            'ALTER TABLE "requests" ALTER COLUMN "status" DROP DEFAULT',
        );
        await queryRunner.query(
            'ALTER TABLE "requests" ALTER COLUMN "status" TYPE "requests_status_enum_old" USING "status"::"text"::"requests_status_enum_old"',
        );
        await queryRunner.query(
            'ALTER TABLE "requests" ALTER COLUMN "status" SET DEFAULT \'ACTIVE\'',
        );
        await queryRunner.query('DROP TYPE "requests_status_enum"');
        await queryRunner.query(
            'ALTER TYPE "requests_status_enum_old" RENAME TO  "requests_status_enum"',
        );
    }
}
