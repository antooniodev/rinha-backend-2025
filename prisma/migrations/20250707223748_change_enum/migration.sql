/*
  Warnings:

  - The values [DEFAULT,FALLBACK] on the enum `PaymentProcessor` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentProcessor_new" AS ENUM ('default', 'fallback');
ALTER TABLE "Payment" ALTER COLUMN "processor" TYPE "PaymentProcessor_new" USING ("processor"::text::"PaymentProcessor_new");
ALTER TYPE "PaymentProcessor" RENAME TO "PaymentProcessor_old";
ALTER TYPE "PaymentProcessor_new" RENAME TO "PaymentProcessor";
DROP TYPE "PaymentProcessor_old";
COMMIT;
