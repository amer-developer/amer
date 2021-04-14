import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUserRoles1618402700683 implements MigrationInterface {
    name = 'alterUserRoles1618402700683';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old"',
        );
        await queryRunner.query(
            "CREATE TYPE \"users_role_enum\" AS ENUM('BUYER', 'SELLER', 'ADMIN')",
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT',
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "role" TYPE "users_role_enum" USING "role"::"text"::"users_role_enum"',
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT \'BUYER\'',
        );
        await queryRunner.query('DROP TYPE "users_role_enum_old"');
        await queryRunner.query('COMMENT ON COLUMN "users"."role" IS NULL');
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT \'BUYER\'',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT \'USER\'',
        );
        await queryRunner.query('COMMENT ON COLUMN "users"."role" IS NULL');
        await queryRunner.query(
            "CREATE TYPE \"users_role_enum_old\" AS ENUM('USER', 'ADMIN')",
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT',
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "role" TYPE "users_role_enum_old" USING "role"::"text"::"users_role_enum_old"',
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT \'BUYER\'',
        );
        await queryRunner.query('DROP TYPE "users_role_enum"');
        await queryRunner.query(
            'ALTER TYPE "users_role_enum_old" RENAME TO  "users_role_enum"',
        );
    }
}
