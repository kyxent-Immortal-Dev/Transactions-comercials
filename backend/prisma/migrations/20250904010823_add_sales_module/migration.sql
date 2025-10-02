-- CreateTable
CREATE TABLE "public"."vendors" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "lastname" VARCHAR(100),
    "email" TEXT,
    "phone" VARCHAR(20),
    "address" TEXT,
    "commission" DOUBLE PRECISION DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."clients" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "lastname" VARCHAR(100),
    "email" TEXT,
    "phone" VARCHAR(20),
    "address" TEXT,
    "company" VARCHAR(100),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."suppliers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "contactName" VARCHAR(100),
    "email" TEXT,
    "phone" VARCHAR(20),
    "address" TEXT,
    "company" VARCHAR(100),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);
