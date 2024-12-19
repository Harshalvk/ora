CREATE TABLE "connections" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text,
	"discordWebhookId" text,
	"notionId" text,
	"slackId" text,
	"userId" text,
	CONSTRAINT "connections_type_unique" UNIQUE("type")
);
--> statement-breakpoint
CREATE TABLE "discordWebhook" (
	"id" text PRIMARY KEY NOT NULL,
	"webhookId" text,
	"url" text,
	"name" text,
	"guildName" text,
	"guildId" text,
	"channelId" text,
	"userId" text,
	CONSTRAINT "discordWebhook_webhookId_unique" UNIQUE("webhookId"),
	CONSTRAINT "discordWebhook_url_unique" UNIQUE("url"),
	CONSTRAINT "discordWebhook_channelId_unique" UNIQUE("channelId")
);
--> statement-breakpoint
CREATE TABLE "localGoogleCredential" (
	"id" text PRIMARY KEY NOT NULL,
	"webhookId" text,
	"folderId" text,
	"pageToken" text,
	"channelId" text,
	"subscribed" boolean DEFAULT false,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" text,
	CONSTRAINT "localGoogleCredential_webhookId_unique" UNIQUE("webhookId"),
	CONSTRAINT "localGoogleCredential_channelId_unique" UNIQUE("channelId")
);
--> statement-breakpoint
CREATE TABLE "notion" (
	"id" text PRIMARY KEY NOT NULL,
	"accessToken" text,
	"workspaceId" text,
	"databaseId" text,
	"workspaceName" text,
	"workspaceIcon" text,
	"userId" text,
	CONSTRAINT "notion_accessToken_unique" UNIQUE("accessToken"),
	CONSTRAINT "notion_workspaceId_unique" UNIQUE("workspaceId"),
	CONSTRAINT "notion_databaseId_unique" UNIQUE("databaseId")
);
--> statement-breakpoint
CREATE TABLE "slack" (
	"id" text PRIMARY KEY NOT NULL,
	"appId" text,
	"authedUserId" text,
	"authedUserToken" text,
	"slackAccessToken" text,
	"botUserId" text,
	"teamId" text,
	"teamName" text,
	"userId" text,
	CONSTRAINT "slack_authedUserToken_unique" UNIQUE("authedUserToken"),
	CONSTRAINT "slack_slackAccessToken_unique" UNIQUE("slackAccessToken")
);
--> statement-breakpoint
CREATE TABLE "workflows" (
	"id" text PRIMARY KEY NOT NULL,
	"nodes" text,
	"edges" text,
	"name" text NOT NULL,
	"discordTemplate" text,
	"notionTemplate" text,
	"notionAccessToken" text,
	"notionDId" text,
	"slackTemplate" text,
	"slackChannels" text,
	"slackAccessToken" text,
	"flowPath" text,
	"cronPath" text,
	"publish" boolean DEFAULT false,
	"description" text NOT NULL,
	"userId" text
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "tier" text DEFAULT 'Free';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "credits" text DEFAULT '10';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "createdAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "localGoogleId" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "googleResourceId" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_localGoogleId_unique" UNIQUE("localGoogleId");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_googleResourceId_unique" UNIQUE("googleResourceId");