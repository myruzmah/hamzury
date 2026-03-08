CREATE TABLE `ridiDonations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`donationRef` varchar(32) NOT NULL,
	`name` varchar(256) NOT NULL,
	`email` varchar(320) NOT NULL,
	`amount` varchar(64) NOT NULL,
	`message` text,
	`status` enum('Pending','Confirmed') NOT NULL DEFAULT 'Pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ridiDonations_id` PRIMARY KEY(`id`),
	CONSTRAINT `ridiDonations_donationRef_unique` UNIQUE(`donationRef`)
);
--> statement-breakpoint
CREATE TABLE `ridiScholarshipApplications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicationRef` varchar(32) NOT NULL,
	`name` varchar(256) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`state` varchar(128) NOT NULL,
	`lga` varchar(128) NOT NULL,
	`age` int NOT NULL,
	`gender` enum('Male','Female','Other') NOT NULL,
	`areaOfInterest` varchar(256) NOT NULL,
	`story` text NOT NULL,
	`status` enum('Pending','Shortlisted','Accepted','Declined') NOT NULL DEFAULT 'Pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ridiScholarshipApplications_id` PRIMARY KEY(`id`),
	CONSTRAINT `ridiScholarshipApplications_applicationRef_unique` UNIQUE(`applicationRef`)
);
