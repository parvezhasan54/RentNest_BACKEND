/*
  Warnings:

  - Added the required column `address` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "availableFrom" TIMESTAMP(3),
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sqft" INTEGER,
ADD COLUMN     "state" TEXT NOT NULL;
