/*
  Warnings:

  - You are about to drop the `GreedHouse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Controller` DROP FOREIGN KEY `Controller_greenHouseID_fkey`;

-- DropForeignKey
ALTER TABLE `Sensor` DROP FOREIGN KEY `Sensor_greenHouseID_fkey`;

-- DropIndex
DROP INDEX `Controller_greenHouseID_fkey` ON `Controller`;

-- DropIndex
DROP INDEX `Sensor_greenHouseID_fkey` ON `Sensor`;

-- DropTable
DROP TABLE `GreedHouse`;

-- CreateTable
CREATE TABLE `GreenHouse` (
    `GID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`GID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sensor` ADD CONSTRAINT `Sensor_greenHouseID_fkey` FOREIGN KEY (`greenHouseID`) REFERENCES `GreenHouse`(`GID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Controller` ADD CONSTRAINT `Controller_greenHouseID_fkey` FOREIGN KEY (`greenHouseID`) REFERENCES `GreenHouse`(`GID`) ON DELETE RESTRICT ON UPDATE CASCADE;
