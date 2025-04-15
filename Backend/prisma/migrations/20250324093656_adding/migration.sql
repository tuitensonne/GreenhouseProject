-- CreateTable
CREATE TABLE `Scheduler` (
    `SID` INTEGER NOT NULL AUTO_INCREMENT,
    `timeCreated` DATETIME(3) NOT NULL,
    `userID` INTEGER NOT NULL,

    PRIMARY KEY (`SID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ControllerScheduler` (
    `status` INTEGER NOT NULL DEFAULT 0,
    `value` INTEGER NULL DEFAULT 0,
    `timeStart` DATETIME(3) NOT NULL,
    `timeEnd` DATETIME(3) NOT NULL,
    `deviceID` INTEGER NOT NULL,
    `schedulerID` INTEGER NOT NULL,

    PRIMARY KEY (`deviceID`, `schedulerID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Scheduler` ADD CONSTRAINT `Scheduler_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ControllerScheduler` ADD CONSTRAINT `ControllerScheduler_deviceID_fkey` FOREIGN KEY (`deviceID`) REFERENCES `Controller`(`CID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ControllerScheduler` ADD CONSTRAINT `ControllerScheduler_schedulerID_fkey` FOREIGN KEY (`schedulerID`) REFERENCES `Scheduler`(`SID`) ON DELETE RESTRICT ON UPDATE CASCADE;
