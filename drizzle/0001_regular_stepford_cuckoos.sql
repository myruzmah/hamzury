CREATE TABLE `agents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` varchar(32) NOT NULL,
	`name` text NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(32),
	`openId` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agents_id` PRIMARY KEY(`id`),
	CONSTRAINT `agents_agentId_unique` UNIQUE(`agentId`),
	CONSTRAINT `agents_email_unique` UNIQUE(`email`),
	CONSTRAINT `agents_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientRef` varchar(32) NOT NULL,
	`name` text NOT NULL,
	`email` varchar(320),
	`accessToken` varchar(128) NOT NULL,
	`servicePackage` varchar(128),
	`startDate` timestamp,
	`deadline` timestamp,
	`status` enum('Inquiry','Proposal','Active','Delivery','Closed') NOT NULL DEFAULT 'Inquiry',
	`invoiceStatus` enum('Not Sent','Sent','Paid','Overdue') NOT NULL DEFAULT 'Not Sent',
	`sheetsRowId` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`),
	CONSTRAINT `clients_clientRef_unique` UNIQUE(`clientRef`),
	CONSTRAINT `clients_accessToken_unique` UNIQUE(`accessToken`)
);
--> statement-breakpoint
CREATE TABLE `communications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientRef` varchar(32) NOT NULL,
	`message` text NOT NULL,
	`author` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `communications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deliverables` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskId` varchar(32),
	`clientRef` varchar(32),
	`title` text NOT NULL,
	`driveFileId` varchar(256),
	`driveUrl` text,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `deliverables_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` varchar(32) NOT NULL,
	`clientName` text NOT NULL,
	`clientEmail` varchar(320),
	`referralDate` timestamp NOT NULL DEFAULT (now()),
	`pipelineStage` enum('Lead','Qualified','Proposal','Negotiation','Closed Won','Closed Lost') NOT NULL DEFAULT 'Lead',
	`commissionEstimate` int DEFAULT 0,
	`commissionStatus` enum('Pending','Approved','Paid') NOT NULL DEFAULT 'Pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sheetsSyncLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sheetName` varchar(128) NOT NULL,
	`lastSyncedAt` timestamp NOT NULL DEFAULT (now()),
	`rowsSynced` int DEFAULT 0,
	`status` enum('success','error') NOT NULL DEFAULT 'success',
	`errorMessage` text,
	CONSTRAINT `sheetsSyncLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskId` varchar(32) NOT NULL,
	`clientRef` varchar(32),
	`clientName` text,
	`servicePackage` varchar(128),
	`description` text,
	`assignedTo` varchar(128),
	`department` varchar(128),
	`deadline` timestamp,
	`status` enum('Not Started','In Progress','Completed','On Hold','Cancelled') NOT NULL DEFAULT 'Not Started',
	`qualityGatePassed` boolean DEFAULT false,
	`receivedDate` timestamp,
	`completedDate` timestamp,
	`sheetsRowId` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`),
	CONSTRAINT `tasks_taskId_unique` UNIQUE(`taskId`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','staff','agent') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `department` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `staffId` varchar(32);