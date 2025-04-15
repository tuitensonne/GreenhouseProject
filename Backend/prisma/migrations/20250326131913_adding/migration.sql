/*
  Warnings:

  - The primary key for the `UserGreenhouse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `notificationId` on the `UserGreenhouse` table. All the data in the column will be lost.
  - Added the required column `greenhouseId` to the `UserGreenhouse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserGreenhouse` DROP PRIMARY KEY,
    DROP COLUMN `notificationId`,
    ADD COLUMN `greenhouseId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`userId`, `greenhouseId`);

-- AddForeignKey
ALTER TABLE `UserGreenhouse` ADD CONSTRAINT `UserGreenhouse_greenhouseId_fkey` FOREIGN KEY (`greenhouseId`) REFERENCES `GreenHouse`(`GID`) ON DELETE RESTRICT ON UPDATE CASCADE;
