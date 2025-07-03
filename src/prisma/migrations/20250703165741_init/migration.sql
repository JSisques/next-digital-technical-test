/*
  Warnings:

  - You are about to drop the `ATM` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ATM" DROP CONSTRAINT "ATM_bankId_fkey";

-- DropTable
DROP TABLE "ATM";

-- CreateTable
CREATE TABLE "Atm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,

    CONSTRAINT "Atm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Atm" ADD CONSTRAINT "Atm_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
