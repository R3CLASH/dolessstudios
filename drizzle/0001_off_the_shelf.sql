ALTER TABLE "inquiries" ADD COLUMN "solution" text;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "addons" text[] DEFAULT '{}' NOT NULL;