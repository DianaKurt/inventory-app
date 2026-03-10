-- AlterTable
ALTER TABLE "Field" ADD COLUMN     "required" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "customIdFormat" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "customIdSeq" INTEGER NOT NULL DEFAULT 1;
