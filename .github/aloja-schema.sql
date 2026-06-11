-- Esquema da Aloja — equivalente ao `prisma db push` de prisma/schema.prisma
-- Aplicado uma única vez pelo workflow setup-db; idempotente.

DO $$ BEGIN
  CREATE TYPE "Plan" AS ENUM ('TRIAL', 'ANFITRIAO', 'PROFISSIONAL', 'AGENCIA');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "DocumentType" AS ENUM ('PASSAPORTE', 'BI', 'CC', 'OUTRO');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "BoletimStatus" AS ENUM ('PENDENTE', 'SUBMETIDO', 'ERRO', 'MANUAL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "plan" "Plan" NOT NULL DEFAULT 'TRIAL',
  "trialEndsAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

CREATE TABLE IF NOT EXISTS "Property" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "alNumber" TEXT NOT NULL,
  "municipality" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "sibaUnidade" TEXT,
  "sibaEstabelecimento" TEXT,
  "sibaChaveAcesso" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Property_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Property_userId_idx" ON "Property"("userId");

CREATE TABLE IF NOT EXISTS "Guest" (
  "id" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "documentType" "DocumentType" NOT NULL,
  "documentNumber" TEXT NOT NULL,
  "documentCountry" CHAR(3) NOT NULL,
  "nationality" CHAR(3) NOT NULL,
  "birthDate" TIMESTAMP(3) NOT NULL,
  "residenceCountry" CHAR(3) NOT NULL,
  "residencePlace" TEXT,
  "checkIn" TIMESTAMP(3) NOT NULL,
  "checkOut" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Guest_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Guest_propertyId_fkey" FOREIGN KEY ("propertyId")
    REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Guest_propertyId_idx" ON "Guest"("propertyId");

CREATE TABLE IF NOT EXISTS "Boletim" (
  "id" TEXT NOT NULL,
  "guestId" TEXT NOT NULL,
  "status" "BoletimStatus" NOT NULL DEFAULT 'PENDENTE',
  "submittedAt" TIMESTAMP(3),
  "sibaResponse" TEXT,
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Boletim_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Boletim_guestId_fkey" FOREIGN KEY ("guestId")
    REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Boletim_guestId_key" ON "Boletim"("guestId");

CREATE TABLE IF NOT EXISTS "Feedback" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "email" TEXT,
  "message" TEXT NOT NULL,
  "page" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
