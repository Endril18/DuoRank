-- CreateTable
CREATE TABLE "Poliglota" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "idiomas" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "ofensiva" INTEGER NOT NULL DEFAULT 0,
    "ultimaAtividade" TIMESTAMP(3),

    CONSTRAINT "Poliglota_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Poliglota_nome_key" ON "Poliglota"("nome");
