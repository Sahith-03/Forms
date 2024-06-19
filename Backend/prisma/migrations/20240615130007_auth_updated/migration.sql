/*
  Warnings:

  - You are about to drop the `form_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form_schema` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `form_schema` DROP FOREIGN KEY `form_schema_userId_fkey`;

-- DropTable
DROP TABLE `form_data`;

-- DropTable
DROP TABLE `form_schema`;

-- CreateTable
CREATE TABLE `form` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `formSchema` JSON NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `formData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `responses` JSON NOT NULL,
    `formId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `form` ADD CONSTRAINT `form_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
