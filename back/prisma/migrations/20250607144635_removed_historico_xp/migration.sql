/*
  Warnings:

  - You are about to drop the `HistoricoXP` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HistoricoXP" DROP CONSTRAINT "HistoricoXP_poliglotaId_fkey";

-- DropTable
DROP TABLE "HistoricoXP";
