-- CreateEnum
CREATE TYPE "PaymentProcessor" AS ENUM ('DEFAULT', 'FALLBACK');

-- CreateTable
CREATE TABLE "Payments" (
    "id" TEXT NOT NULL,
    "correlationId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "processor" "PaymentProcessor" NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payments_correlationId_key" ON "Payments"("correlationId");
