-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_creditedAccountId_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_debitedAccountId_fkey";

-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "accountId" INTEGER,
ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
