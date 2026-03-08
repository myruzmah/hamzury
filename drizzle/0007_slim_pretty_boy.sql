CREATE TABLE `expenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`expenseRef` varchar(32) NOT NULL,
	`submittedByStaffId` varchar(32) NOT NULL,
	`submittedByName` varchar(256) NOT NULL,
	`department` varchar(128) NOT NULL,
	`description` text NOT NULL,
	`amountNaira` int NOT NULL,
	`category` enum('Operations','Travel','Equipment','Software','Training','Marketing','Other') NOT NULL DEFAULT 'Operations',
	`approvalLevel` enum('lead','ceo','founder') NOT NULL,
	`status` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
	`approvedByStaffId` varchar(32),
	`approvedByName` varchar(256),
	`approvedAt` timestamp,
	`rejectionReason` text,
	`receiptUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `expenses_id` PRIMARY KEY(`id`),
	CONSTRAINT `expenses_expenseRef_unique` UNIQUE(`expenseRef`)
);
--> statement-breakpoint
CREATE TABLE `innovationEnrolments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enrolmentRef` varchar(32) NOT NULL,
	`participantName` varchar(256) NOT NULL,
	`participantEmail` varchar(320) NOT NULL,
	`participantPhone` varchar(32),
	`programmeType` enum('Executive Class','Young Innovators','Tech Bootcamp','Internship','Corporate Training','Robotics') NOT NULL,
	`cohort` varchar(64),
	`status` enum('Applied','Shortlisted','Enrolled','Completed','Withdrawn') NOT NULL DEFAULT 'Applied',
	`source` enum('Direct','RIDI Scholarship','Corporate','Agent Referral') NOT NULL DEFAULT 'Direct',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `innovationEnrolments_id` PRIMARY KEY(`id`),
	CONSTRAINT `innovationEnrolments_enrolmentRef_unique` UNIQUE(`enrolmentRef`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`invoiceRef` varchar(32) NOT NULL,
	`clientRef` varchar(32),
	`clientName` varchar(256) NOT NULL,
	`clientEmail` varchar(320),
	`taskRef` varchar(32),
	`description` text NOT NULL,
	`amountNaira` int NOT NULL DEFAULT 0,
	`ridiAllocation` int NOT NULL DEFAULT 0,
	`status` enum('Draft','Sent','Paid','Overdue','Cancelled') NOT NULL DEFAULT 'Draft',
	`dueDate` timestamp,
	`paidAt` timestamp,
	`createdByStaffId` varchar(32) NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_invoiceRef_unique` UNIQUE(`invoiceRef`)
);
--> statement-breakpoint
CREATE TABLE `taskComments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskRef` varchar(32) NOT NULL,
	`authorStaffId` varchar(32) NOT NULL,
	`authorName` varchar(256) NOT NULL,
	`authorRole` varchar(64) NOT NULL,
	`message` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `taskComments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `uccForms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` varchar(32) NOT NULL,
	`intakeRef` varchar(32),
	`businessName` varchar(256) NOT NULL,
	`contactName` varchar(256) NOT NULL,
	`contactEmail` varchar(320) NOT NULL,
	`contactPhone` varchar(32) NOT NULL,
	`industry` varchar(256) NOT NULL,
	`businessGoals` text NOT NULL,
	`currentChallenges` text NOT NULL,
	`targetAudience` text,
	`budgetRange` enum('Under ₦100k','₦100k–₦500k','₦500k–₦1m','₦1m–₦5m','Above ₦5m') NOT NULL,
	`timeline` enum('Urgen') NOT NULL,
	`preferredContact` enum('Email','WhatsApp','Phone','Any') NOT NULL DEFAULT 'WhatsApp',
	`additionalNotes` text,
	`csoLeadId` varchar(32),
	`status` enum('Submitted','Reviewed','Clarity Sent','Converted','Lost') NOT NULL DEFAULT 'Submitted',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `uccForms_id` PRIMARY KEY(`id`),
	CONSTRAINT `uccForms_clientId_unique` UNIQUE(`clientId`)
);
