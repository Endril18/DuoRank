-- CreateTable
CREATE TABLE "HistoricoXP" (
    "id" SERIAL NOT NULL,
    "poliglotaId" INTEGER NOT NULL,
    "xpAlterado" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricoXP_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HistoricoXP" ADD CONSTRAINT "HistoricoXP_poliglotaId_fkey" FOREIGN KEY ("poliglotaId") REFERENCES "Poliglota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
