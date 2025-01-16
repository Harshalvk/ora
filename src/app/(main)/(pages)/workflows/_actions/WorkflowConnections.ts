"use server";

import { eq } from "drizzle-orm";
import { auth } from "../../../../../../auth";
import { db } from "@/db/index";
import { users, workflows } from "@/db/schema";
import { Option } from "@/store";

export const getGoogleListener = async () => {
  const session = await auth();

  if (!session || !session.user) {
    return undefined; //if there's no session or user
  }

  const { id: userId } = session.user;

  if (userId) {
    const listener = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        googleResourceId: true,
      },
    });

    if (listener) return listener;
  }
};

export const onCreateNodeTemplate = async (
  content: string,
  type: string,
  workflowId: string,
  channels?: Option[],
  accessToken?: string,
  notionDbId?: string
) => {
  const currentWorkflow = await db
    .select({
      slackChannels: workflows.slackChannels,
    })
    .from(workflows)
    .where(eq(workflows.id, workflowId))
    .execute();

  if (type === "Discord") {
    const response = await db
      .update(workflows)
      .set({ discordTemplate: content })
      .where(eq(workflows.id, workflowId))
      .returning();

    if (response) {
      return "Discord template saved";
    }
  }

  if (type === "Slack") {
    const response = await db
      .update(workflows)
      .set({ slackTemplate: content, slackAccessToken: accessToken })
      .where(eq(workflows.id, workflowId))
      .returning();

    if (response) {
      const channelList = await db
        .select({
          slackChannels: workflows.slackChannels,
        })
        .from(workflows)
        .where(eq(workflows.id, workflowId));

      if (channelList.length > 0) {
        //remove duplicates before insert
        if (!channelList[0].slackChannels)
          throw new Error("Slack channel does not exits");

        const NonDuplicated = channelList[0].slackChannels.filter(
          (channel) => channel !== channels![0].values
        );

        NonDuplicated!
          .map((channel) => channel)
          .forEach(async (channel) => {
            if (currentWorkflow.length > 0) {
              const currentChannles = currentWorkflow[0].slackChannels;
              if (!currentChannles)
                throw new Error("Slack channel does not exits");

              if (!currentChannles.includes(channel)) {
                const updatedChannels = [...currentChannles, channel];

                await db
                  .update(workflows)
                  .set({
                    slackChannels: updatedChannels,
                  })
                  .where(eq(workflows.id, workflowId));
              }
            }
          });
      }

      return "Slack template saved";
    }

    channels!
      .map((channel) => channel.value)
      .forEach(async (channel) => {
        if (currentWorkflow.length > 0) {
          const currentChannles = currentWorkflow[0].slackChannels;
          if (!currentChannles) throw new Error("Slack channel does not exits");

          if (!currentChannles.includes(channel)) {
            const updatedChannels = [...currentChannles, channel];

            await db
              .update(workflows)
              .set({
                slackChannels: updatedChannels,
              })
              .where(eq(workflows.id, workflowId));
          }
        }
      });

    return "Slack template saved";
  }

  if (type === "Notion") {
    const response = await db
      .update(workflows)
      .set({
        notionTemplate: content,
        notionAccessToken: accessToken,
        notionDId: notionDbId,
      })
      .where(eq(workflows.id, workflowId));

    if (response) return "Notion template saved";
  }
};

export const onGetWorkflows = async () => {
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
    const workflow = await db.query.workflows.findMany({
      where: eq(users.id, user.id),
    });

    if (workflow) return workflow;
  }
};