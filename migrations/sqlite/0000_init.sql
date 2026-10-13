-- nodefony:migration format=1
CREATE TABLE `User` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`password` text,
	`roles` text NOT NULL,
	`enabled` integer NOT NULL,
	`locked` integer NOT NULL,
	`currentRole` text,
	`socialProviders` text NOT NULL,
	`metadata` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `User_identifier_unique` ON `User` (`identifier`);