-- CreateTable
CREATE TABLE `GreedHouse` (
    `GID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`GID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `username` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sensor` (
    `SID` INTEGER NOT NULL AUTO_INCREMENT,
    `maxValue` INTEGER NULL,
    `deviceType` VARCHAR(191) NOT NULL,
    `sensorType` VARCHAR(191) NOT NULL,
    `topic` VARCHAR(191) NOT NULL,
    `greenHouseID` INTEGER NOT NULL,
    `userID` INTEGER NULL,

    UNIQUE INDEX `Sensor_topic_key`(`topic`),
    PRIMARY KEY (`SID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SensorRecord` (
    `SRID` INTEGER NOT NULL AUTO_INCREMENT,
    `value` INTEGER NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL,
    `deviceID` INTEGER NOT NULL,

    PRIMARY KEY (`SRID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Controller` (
    `CID` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceType` VARCHAR(191) NOT NULL,
    `controllerType` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `topic` VARCHAR(191) NOT NULL,
    `greenHouseID` INTEGER NOT NULL,
    `userID` INTEGER NULL,

    UNIQUE INDEX `Controller_topic_key`(`topic`),
    PRIMARY KEY (`CID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ControllerRecord` (
    `CRID` INTEGER NOT NULL AUTO_INCREMENT,
    `value` INTEGER NOT NULL DEFAULT 0,
    `dateCreated` DATETIME(3) NOT NULL,
    `deviceID` INTEGER NOT NULL,
    `userID` INTEGER NULL,

    PRIMARY KEY (`CRID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sensor` ADD CONSTRAINT `Sensor_greenHouseID_fkey` FOREIGN KEY (`greenHouseID`) REFERENCES `GreedHouse`(`GID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sensor` ADD CONSTRAINT `Sensor_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SensorRecord` ADD CONSTRAINT `SensorRecord_deviceID_fkey` FOREIGN KEY (`deviceID`) REFERENCES `Sensor`(`SID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Controller` ADD CONSTRAINT `Controller_greenHouseID_fkey` FOREIGN KEY (`greenHouseID`) REFERENCES `GreedHouse`(`GID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Controller` ADD CONSTRAINT `Controller_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ControllerRecord` ADD CONSTRAINT `ControllerRecord_deviceID_fkey` FOREIGN KEY (`deviceID`) REFERENCES `Controller`(`CID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ControllerRecord` ADD CONSTRAINT `ControllerRecord_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;
