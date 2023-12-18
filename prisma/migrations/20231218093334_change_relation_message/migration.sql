/*
  Warnings:

  - You are about to drop the column `replyFor` on the `Message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authorId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[receivedId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[replyForId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "replyFor",
ADD COLUMN     "receivedId" TEXT,
ADD COLUMN     "replyForId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Message_authorId_key" ON "Message"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_receivedId_key" ON "Message"("receivedId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_replyForId_key" ON "Message"("replyForId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receivedId_fkey" FOREIGN KEY ("receivedId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_replyForId_fkey" FOREIGN KEY ("replyForId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
