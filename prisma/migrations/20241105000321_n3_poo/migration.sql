/*
  Warnings:

  - You are about to drop the `Aluno` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Aluno";

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "tipo" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Livro" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "paginas" INTEGER,
    "autor" TEXT NOT NULL,
    "editora" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Livro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Biblioteca" (
    "id" SERIAL NOT NULL,
    "id_livro" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "quantidade_disp" INTEGER NOT NULL,

    CONSTRAINT "Biblioteca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locacao" (
    "id" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_livro" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_devolucao" TIMESTAMP(3),
    "valor" DOUBLE PRECISION NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Locacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Biblioteca" ADD CONSTRAINT "Biblioteca_id_livro_fkey" FOREIGN KEY ("id_livro") REFERENCES "Livro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locacao" ADD CONSTRAINT "Locacao_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locacao" ADD CONSTRAINT "Locacao_id_livro_fkey" FOREIGN KEY ("id_livro") REFERENCES "Livro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
