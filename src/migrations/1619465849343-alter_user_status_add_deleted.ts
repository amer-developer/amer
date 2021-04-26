import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUserStatusAddDeleted1619465849343
    implements MigrationInterface {
    name = 'alterUserStatusAddDeleted1619465849343';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TYPE "public"."users_status_enum" RENAME TO "users_status_enum_old"',
        );
        await queryRunner.query(
            "CREATE TYPE \"users_status_enum\" AS ENUM('ACTIVE', 'INACTIVE', 'BLOCKED', 'DELETED')",
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT',
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "status" TYPE "users_status_enum" USING "status"::"text"::"users_status_enum"',
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT \'INACTIVE\'',
        );
        await queryRunner.query('DROP TYPE "users_status_enum_old"');
        await queryRunner.query('COMMENT ON COLUMN "users"."status" IS NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('COMMENT ON COLUMN "users"."status" IS NULL');
        await queryRunner.query(
            "CREATE TYPE \"users_status_enum_old\" AS ENUM('ACTIVE', 'INACTIVE', 'BLOCKED')",
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT',
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "status" TYPE "users_status_enum_old" USING "status"::"text"::"users_status_enum_old"',
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT \'INACTIVE\'',
        );
        await queryRunner.query('DROP TYPE "users_status_enum"');
        await queryRunner.query(
            'ALTER TYPE "users_status_enum_old" RENAME TO  "users_status_enum"',
        );
    }
}
