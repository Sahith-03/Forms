/*
  Warnings:

  - You are about to drop the column `formSchemaId` on the `form_data` table. All the data in the column will be lost.
  - Added the required column `userId` to the `form_schema` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `form_data` DROP FOREIGN KEY `form_data_formSchemaId_fkey`;

-- AlterTable
ALTER TABLE `form_data` DROP COLUMN `formSchemaId`;

-- AlterTable
ALTER TABLE `form_schema` ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `form_schema` ADD CONSTRAINT `form_schema_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
