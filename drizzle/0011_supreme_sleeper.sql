ALTER TABLE `staffMembers` ADD `mustChangePassword` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `staffMembers` ADD `lastPasswordChange` timestamp;--> statement-breakpoint
ALTER TABLE `staffMembers` ADD `dashboardRole` enum('founder','ceo','cso','bizdev','finance','hr','staff','helper','affiliate');