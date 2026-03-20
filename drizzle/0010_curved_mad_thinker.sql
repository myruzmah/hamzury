ALTER TABLE `invoices` ADD `receiptUrl` text;--> statement-breakpoint
ALTER TABLE `invoices` ADD `receiptFileName` varchar(256);--> statement-breakpoint
ALTER TABLE `invoices` ADD `receiptUploadedAt` timestamp;--> statement-breakpoint
ALTER TABLE `invoices` ADD `internationalPaymentLink` text;--> statement-breakpoint
ALTER TABLE `invoices` ADD `paymentMethod` enum('bank_transfer','international_link','paystack');