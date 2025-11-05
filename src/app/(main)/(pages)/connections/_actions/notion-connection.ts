"use server";

import { db } from "@/db";
import { auth } from "../../../../../../auth";
import { Client } from "@notionhq/client";
import { eq } from "drizzle-orm";
import { connections, notion } from "@/db/schema";

export const onNotionConnect = async (
  access_token: string,
  workspace_id: string,
  workspace_icon: string,
  workspace_name: string,
  database_id: string,
  id: string
) => {
  "use server";
  if (access_token) {
    //check if notion is connected
    const notion_connected = await db.query.notion.findFirst({
      where: eq(notion.accessToken, access_token),
      with: {
        connections: true,
      },
    });

    if (!notion_connected) {
      //create connection
      await db.transaction(async (tx) => {
        await tx
          .insert(notion)
          .values({
            userId: id,
            workspaceIcon: workspace_icon,
            accessToken: access_token,
            workspaceId: workspace_id,
            workspaceName: workspace_name,
            databaseId: database_id,
          })
          .returning();

        await tx.insert(connections).values({
          userId: id,
          type: "Notion",
        });
      });
    }
  }
};

export const getNotionConnection = async () => {
  const session = await auth();

  if (!session || !session.user) {
    return undefined; //if there's no session or user
  }

  const user = session.user;

  //ensuring user.id is defined and is a string
  if (typeof user.id !== "string") {
    return undefined;
  }

  if (user) {
    const connection = await db.query.notion.findFirst({
      where: eq(notion.userId, user.id),
    });

    if (connection) {
      return connection;
    }
  }
};

export const getNotionDatabase = async (
  databaseId: string,
  accessToken: string
) => {
  const notion = new Client({
    auth: accessToken,
  });

  const response = await notion.databases.retrieve({ database_id: databaseId });
  return response;
};

export type NotionNodeContentType = {
  name: string;
  kind: string;
  type: string;
};
export const onCreateNewPageInDatabase = async (
  databaseId: string,
  accessToken: string,
  content: string
) => {
  const notion = new Client({
    auth: accessToken,
  });

  const response = await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: databaseId,
    },
    properties: {
      Name: [
        {
          text: {
            // content: content.name,
            content: "Testing",
          },
        },
      ],
    },
  });

  if (response) {
    return response;
  }
};
