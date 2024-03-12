// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class InitialMigration1709803736944 implements MigrationInterface {
//   name = 'InitialMigration1709803736944';

//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       `CREATE TABLE "jwt-test-users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying NOT NULL, "address" character varying NOT NULL, "bio" character varying NOT NULL, CONSTRAINT "UQ_730a8386df588bb174681d13af0" UNIQUE ("email"), CONSTRAINT "PK_74290b8e424a74f31072b82f943" PRIMARY KEY ("id"))`,
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`DROP TABLE "jwt-test-users"`);
//   }
// }
