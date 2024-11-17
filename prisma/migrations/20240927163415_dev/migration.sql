-- CreateTable
CREATE TABLE "Aluno" (
    "indice" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ra" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "imei" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "hora_post" TIMESTAMP(3),

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("indice")
);
