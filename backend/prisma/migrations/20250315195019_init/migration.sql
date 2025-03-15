-- CreateTable
CREATE TABLE "Poliglota" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "idiomas" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "ofensiva" INTEGER NOT NULL DEFAULT 0,
    "ultimaAtividade" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Poliglota_pkey" PRIMARY KEY ("id")
);
