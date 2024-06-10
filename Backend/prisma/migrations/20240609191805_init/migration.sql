-- CreateTable
CREATE TABLE `form_schema` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `field_name` VARCHAR(191) NOT NULL,
    `field_type` VARCHAR(191) NOT NULL,
    `options` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `form_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `formSchemaId` INTEGER NOT NULL,
    `responses` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `form_data` ADD CONSTRAINT `form_data_formSchemaId_fkey` FOREIGN KEY (`formSchemaId`) REFERENCES `form_schema`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
