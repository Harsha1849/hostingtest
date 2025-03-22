/*
  Warnings:

  - Made the column `phone` on table `ContactRequest` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `preferredDate` on the `ContactRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ContactRequest" ADD COLUMN     "userId" TEXT,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "message" DROP NOT NULL,
DROP COLUMN "preferredDate",
ADD COLUMN     "preferredDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "ContactRequest" ADD CONSTRAINT "ContactRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
