-- CreateTable
CREATE TABLE "FiltroGuardado" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" TEXT,
    "fecha" TEXT,
    "CodigoOrganismo" TEXT,
    "modo" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FiltroGuardado_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FiltroGuardado" ADD CONSTRAINT "FiltroGuardado_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
