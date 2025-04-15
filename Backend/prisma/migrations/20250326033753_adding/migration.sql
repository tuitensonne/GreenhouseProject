-- CreateTable
CREATE TABLE `Notification` (
    `NID` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL,
    `userID` INTEGER NOT NULL,

    PRIMARY KEY (`NID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
