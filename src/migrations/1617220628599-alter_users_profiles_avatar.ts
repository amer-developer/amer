import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUsersProfilesAvatar1617220628599
    implements MigrationInterface {
    name = 'alterUsersProfilesAvatar1617220628599';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "users" DROP COLUMN "avatar"');
        await queryRunner.query(
            'ALTER TABLE "profiles" ADD "avatar" character varying',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "profiles" DROP COLUMN "avatar"');
        await queryRunner.query(
            'ALTER TABLE "users" ADD "avatar" character varying',
        );
    }
}
