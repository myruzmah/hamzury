CREATE TABLE `auditTrail` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskRef` varchar(32) NOT NULL,
	`staffId` varchar(32) NOT NULL,
	`staffName` varchar(256) NOT NULL,
	`action` varchar(512) NOT NULL,
	`stage` enum('pre','during','post','system') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditTrail_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `checklistItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskRef` varchar(32) NOT NULL,
	`stage` enum('pre','during','post') NOT NULL,
	`stepOrder` int NOT NULL,
	`stepText` text NOT NULL,
	`isCompleted` boolean NOT NULL DEFAULT false,
	`isRequired` boolean NOT NULL DEFAULT true,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `checklistItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `founderNotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(512) NOT NULL,
	`content` text NOT NULL,
	`isPrivate` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `founderNotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sopTemplates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`department` varchar(128) NOT NULL,
	`serviceType` varchar(256) NOT NULL,
	`stage` enum('pre','during','post') NOT NULL,
	`stepOrder` int NOT NULL,
	`stepText` text NOT NULL,
	`isRequired` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sopTemplates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `staffMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staffId` varchar(32) NOT NULL,
	`name` varchar(256) NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(256) NOT NULL,
	`institutionalRole` enum('founder','ceo','lead','staff') NOT NULL DEFAULT 'staff',
	`primaryDepartment` enum('CSO','Systems','Studios','Bizdoc','Innovation','Growth','People','Ledger','Executive','Founder','RIDI','Robotics') NOT NULL,
	`secondaryDepartments` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp,
	CONSTRAINT `staffMembers_id` PRIMARY KEY(`id`),
	CONSTRAINT `staffMembers_staffId_unique` UNIQUE(`staffId`),
	CONSTRAINT `staffMembers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `taskLifecycle` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskRef` varchar(32) NOT NULL,
	`title` varchar(512) NOT NULL,
	`clientRef` varchar(32),
	`clientName` varchar(256),
	`department` varchar(128) NOT NULL,
	`serviceType` varchar(256) NOT NULL,
	`assignedByStaffId` varchar(32),
	`assignedToStaffId` varchar(32) NOT NULL,
	`lifecycleStage` enum('pre','during','post','review','approved','rejected','closed') NOT NULL DEFAULT 'pre',
	`priority` enum('normal','urgent') NOT NULL DEFAULT 'normal',
	`deadline` timestamp,
	`notes` text,
	`rejectionComment` text,
	`reviewedByStaffId` varchar(32),
	`reviewedAt` timestamp,
	`closedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `taskLifecycle_id` PRIMARY KEY(`id`),
	CONSTRAINT `taskLifecycle_taskRef_unique` UNIQUE(`taskRef`)
);
