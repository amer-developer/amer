import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUsersTableStatus1618060814171 implements MigrationInterface {
    name = 'alterUsersTableStatus1618060814171';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "CREATE TYPE \"users_status_enum\" AS ENUM('ACTIVE', 'INACTIVE', 'BLOCKED')",
        );
        await queryRunner.query(
            'ALTER TABLE "users" ADD "status" "users_status_enum" NOT NULL DEFAULT \'INACTIVE\'',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "users" DROP COLUMN "status"');
        await queryRunner.query('DROP TYPE "users_status_enum"');
    }
}
