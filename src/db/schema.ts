import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
} from "drizzle-orm/pg-core";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { AdapterAccountType } from "next-auth/adapters";
import { relations } from "drizzle-orm";

const pool = postgres(process.env.DATABASE_URL!, { max: 1 });

export const db = drizzle(pool);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  tier: text("tier").default("Free"),
  credits: text("credits").default("10"),

  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  localGoogleId: text("localGoogleId").unique(),
  googleResourceId: text("googleResourceId").unique(),
});

export const localGoogleCredential = pgTable("localGoogleCredential", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  webhookId: text("webhookId").unique(),

  folderId: text("folderId"),
  pageToken: text("pageToken"),
  channelId: text("channelId")
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
  subscribed: boolean("subscribed").default(false),

  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),

  userId: text("userId"),
});

export const localGoogleCredentialRelations = relations(
  localGoogleCredential,
  ({ one }) => ({
    user: one(users, {
      fields: [localGoogleCredential.userId],
      references: [users.id],
    }),
  })
);

export const discordWebhook = pgTable("discordWebhook", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  webhookId: text("webhookId").unique(),
  url: text("url").unique(),
  name: text("name"),
  guildName: text("guildName"),
  guildId: text("guildId"),
  channelId: text("channelId").unique(),
  userId: text("userId"),
});

export const discordWebhookRelations = relations(discordWebhook, ({ one }) => ({
  user: one(users, {
    fields: [discordWebhook.userId],
    references: [users.id],
  }),
}));

export const slack = pgTable("slack", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  appId: text("appId"),
  authedUserId: text("authedUserId"),
  authedUserToken: text("authedUserToken").unique(),
  slackAccessToken: text("slackAccessToken").unique(),
  botUserId: text("botUserId"),
  teamId: text("teamId"),
  teamName: text("teamName"),

  userId: text("userId"),
});

export const slackRealtions = relations(slack, ({ one }) => ({
  user: one(users, {
    fields: [slack.userId],
    references: [users.id],
  }),
}));

export const notion = pgTable("notion", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  accessToken: text("accessToken").unique(),
  workspaceId: text("workspaceId").unique(),
  databaseId: text("databaseId").unique(),
  workspaceName: text("workspaceName"),
  workspaceIcon: text("workspaceIcon"),
  userId: text("userId"),
});

export const notionRealtions = relations(notion, ({ one, many }) => ({
  user: one(users, {
    fields: [notion.userId],
    references: [users.id],
  }),
  connections: many(connections),
}));

export const connections = pgTable("connections", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  type: text("type").unique(),
  discordWebhookId: text("discordWebhookId"),
  notionId: text("notionId"),
  slackId: text("slackId"),
  userId: text("userId"),
});

export const connectionsRelations = relations(connections, ({ one }) => ({
  discordWebhook: one(discordWebhook, {
    fields: [connections.discordWebhookId],
    references: [discordWebhook.id],
  }),
  notion: one(notion, {
    fields: [connections.notionId],
    references: [notion.id],
  }),
  slack: one(slack, {
    fields: [connections.slackId],
    references: [slack.id],
  }),
  user: one(users, {
    fields: [connections.userId],
    references: [users.id],
  }),
}));

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);
