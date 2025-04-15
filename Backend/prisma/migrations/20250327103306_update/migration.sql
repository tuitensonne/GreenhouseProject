/*
  Warnings:

  - You are about to alter the column `value` on the `SensorRecord` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `Sensor` ADD COLUMN `value` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `SensorRecord` MODIFY `value` DOUBLE NOT NULL;
