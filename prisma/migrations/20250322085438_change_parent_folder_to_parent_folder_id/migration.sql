/*
  Warnings:

  - You are about to drop the column `parentFolder` on the `Folder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "parentFolder",
ADD COLUMN     "parentFolderId" INTEGER;
