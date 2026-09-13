CREATE TABLE `drive_files` (
	`id` varchar(64) NOT NULL,
	`moduleId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(128) NOT NULL,
	`extension` varchar(32) NOT NULL,
	`sizeBytes` int NOT NULL DEFAULT 0,
	`driveId` varchar(128),
	`driveWebLink` text,
	`downloadUrl` text,
	`brand` varchar(64),
	`ecuType` varchar(64),
	`softwareName` varchar(128),
	`version` varchar(64),
	`description` text,
	`tags` text,
	`isVerified` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `drive_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` varchar(64) NOT NULL,
	`code` varchar(32) NOT NULL,
	`title` varchar(255) NOT NULL,
	`subtitle` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`icon` varchar(64) NOT NULL,
	`accentColor` varchar(32) NOT NULL DEFAULT '#38bdf8',
	`tags` text NOT NULL,
	`fileCountEstimate` int NOT NULL DEFAULT 0,
	`driveFolderId` varchar(128),
	`orderIndex` int NOT NULL DEFAULT 0,
	`requiresVip` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `modules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `purchases` (
	`id` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`planName` varchar(64) NOT NULL,
	`amountUsd` int NOT NULL,
	`status` enum('pending','completed','cancelled') NOT NULL DEFAULT 'completed',
	`referenceCode` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `purchases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `membershipStatus` enum('free','vip_lifetime','vip_monthly') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `membershipExpiresAt` timestamp;