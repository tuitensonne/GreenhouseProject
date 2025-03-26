-- CreateTable
CREATE TABLE `UserGreenhouse` (
    `userId` INTEGER NOT NULL,
    `notificationId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `notificationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserGreenhouse` ADD CONSTRAINT `UserGreenhouse_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
