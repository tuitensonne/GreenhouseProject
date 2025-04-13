/*
  Warnings:

  - Made the column `userID` on table `Controller` required. This step will fail if there are existing NULL values in that column.
  - Made the column `value` on table `Controller` required. This step will fail if there are existing NULL values in that column.
  - Made the column `value` on table `ControllerRecord` required. This step will fail if there are existing NULL values in that column.
  - Made the column `value` on table `ControllerScheduler` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `isRead` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Made the column `userID` on table `Sensor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Controller` DROP FOREIGN KEY `Controller_userID_fkey`;

-- DropForeignKey
ALTER TABLE `Sensor` DROP FOREIGN KEY `Sensor_userID_fkey`;

-- DropIndex
DROP INDEX `Controller_userID_fkey` ON `Controller`;

-- DropIndex
DROP INDEX `Sensor_userID_fkey` ON `Sensor`;

-- AlterTable
ALTER TABLE `Controller` MODIFY `userID` INTEGER NOT NULL,
    MODIFY `value` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `ControllerRecord` MODIFY `value` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `ControllerScheduler` ADD COLUMN `status` INTEGER NOT NULL DEFAULT 0,
    MODIFY `value` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Notification` ADD COLUMN `isRead` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `Sensor` MODIFY `userID` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Sensor` ADD CONSTRAINT `Sensor_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Controller` ADD CONSTRAINT `Controller_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
