CREATE TABLE `leadReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportRef` varchar(32) NOT NULL,
	`submittedByStaffId` varchar(32) NOT NULL,
	`submittedByName` varchar(256) NOT NULL,
	`department` varchar(128) NOT NULL,
	`weekEnding` timestamp NOT NULL,
	`win1` text NOT NULL,
	`win2` text NOT NULL,
	`win3` text NOT NULL,
	`blocker1` text NOT NULL,
	`blocker2` text NOT NULL,
	`keyInfo` text NOT NULL,
	`tasksCompleted` int NOT NULL DEFAULT 0,
	`tasksInProgress` int NOT NULL DEFAULT 0,
	`tasksOverdue` int NOT NULL DEFAULT 0,
	`isReadByFounder` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leadReports_id` PRIMARY KEY(`id`),
	CONSTRAINT `leadReports_reportRef_unique` UNIQUE(`reportRef`)
);
--> statement-breakpoint
CREATE TABLE `staffNotifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staffId` varchar(32) NOT NULL,
	`title` varchar(512) NOT NULL,
	`message` text NOT NULL,
	`type` enum('task_assigned','task_approved','task_rejected','general') NOT NULL DEFAULT 'general',
	`taskRef` varchar(32),
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `staffNotifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `taskFiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskRef` varchar(32) NOT NULL,
	`uploadedByStaffId` varchar(32) NOT NULL,
	`uploadedByName` varchar(256) NOT NULL,
	`fileName` varchar(512) NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`fileUrl` text NOT NULL,
	`mimeType` varchar(128),
	`fileSizeBytes` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `taskFiles_id` PRIMARY KEY(`id`)
);
