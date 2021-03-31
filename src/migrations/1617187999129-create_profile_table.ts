import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProfileTable1617187999129 implements MigrationInterface {
    name = 'createProfileTable1617187999129';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(),
             "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "bio" character varying, CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query('ALTER TABLE "users" ADD "profile_id" uuid');
        await queryRunner.query(
            'ALTER TABLE "users" ADD CONSTRAINT "UQ_23371445bd80cb3e413089551bf" UNIQUE ("profile_id")',
        );
        await queryRunner.query(
            'ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old"',
        );
        await queryRunner.query(
            "CREATE TYPE \"users_role_enum\" AS ENUM('USER', 'ADMIN')",
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT',
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "role" TYPE "users_role_enum" USING "role"::"text"::"users_role_enum"',
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT \'USER\'',
        );
        await queryRunner.query('DROP TYPE "users_role_enum_old"');
        await queryRunner.query('COMMENT ON COLUMN "users"."role" IS NULL');
        await queryRunner.query('COMMENT ON COLUMN "users"."email" IS NULL');
        await queryRunner.query(
            'ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"',
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "phone" SET NOT NULL',
        );
        await queryRunner.query('COMMENT ON COLUMN "users"."phone" IS NULL');
        await queryRunner.query(
            'ALTER TABLE "users" ADD CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone")',
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_23371445bd80cb3e413089551bf" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id")
             ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "users" DROP CONSTRAINT "FK_23371445bd80cb3e413089551bf"',
        );
        await queryRunner.query(
            'ALTER TABLE "users" DROP CONSTRAINT "UQ_a000cca60bcf04454e727699490"',
        );
        await queryRunner.query('COMMENT ON COLUMN "users"."phone" IS NULL');
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL',
        );
        await queryRunner.query(
            'ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")',
        );
        await queryRunner.query('COMMENT ON COLUMN "users"."email" IS NULL');
        await queryRunner.query('COMMENT ON COLUMN "users"."role" IS NULL');
        await queryRunner.query(
            'CREATE TYPE "users_role_enum_old" AS ENUM(\'USER\')',
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT',
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "role" TYPE "users_role_enum_old" USING "role"::"text"::"users_role_enum_old"',
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT \'USER\'',
        );
        await queryRunner.query('DROP TYPE "users_role_enum"');
        await queryRunner.query(
            'ALTER TYPE "users_role_enum_old" RENAME TO  "users_role_enum"',
        );
        await queryRunner.query(
            'ALTER TABLE "users" DROP CONSTRAINT "UQ_23371445bd80cb3e413089551bf"',
        );
        await queryRunner.query('ALTER TABLE "users" DROP COLUMN "profile_id"');
        await queryRunner.query('DROP TABLE "profiles"');
    }
}
