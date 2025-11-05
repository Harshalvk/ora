ALTER TABLE "workflows" ALTER COLUMN "slackChannels" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "tier" text DEFAULT 'Free';--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "credits" text DEFAULT '10';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "driveConnected" boolean DEFAULT false;