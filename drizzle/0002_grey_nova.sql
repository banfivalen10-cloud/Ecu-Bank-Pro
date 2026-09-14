ALTER TABLE `drive_files` MODIFY COLUMN `sizeBytes` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `modules` MODIFY COLUMN `requiresVip` boolean NOT NULL DEFAULT false;