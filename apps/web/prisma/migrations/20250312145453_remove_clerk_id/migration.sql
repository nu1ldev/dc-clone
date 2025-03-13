/*
  Warnings:

  - You are about to drop the column `clerk_id` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_clerk_id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clerk_id";
