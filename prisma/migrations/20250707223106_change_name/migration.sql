/*
  Warnings:

  - You are about to drop the `Payments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Payments";

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "correlationId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "processor" "PaymentProcessor" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_correlationId_key" ON "Payment"("correlationId");
