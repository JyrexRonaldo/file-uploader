-- CreateEnum
CREATE TYPE "Type" AS ENUM ('FOLDER', 'FILE');

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'FILE';

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'FOLDER';
