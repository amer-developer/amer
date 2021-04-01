import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUsersTableNullable1617275962707
    implements MigrationInterface {
    name = 'alterUsersTableNullable1617275962707';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL',
        );
        await queryRunner.query('COMMENT ON COLUMN "users"."name" IS NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('COMMENT ON COLUMN "users"."name" IS NULL');
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL',
        );
    }
}
