-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_accountId_fkey";

-- DropIndex
DROP INDEX "User_password_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "accountId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
