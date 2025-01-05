"use server";

import { db } from "@/db/index";
import { connections, slack } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "../../../../../../auth";
import { Option } from "@/components/ui/multiple-selector";

export const onSlackConnect = async (
  app_id: string,
  authed_user_id: string,
  authed_access_token: string,
  slack_access_token: string,
  bot_user_id: string,
  team_id: string,
  team_name: string,
  user_id: string
): Promise<void> => {
  if (!slack_access_token) return;

  const slackConnection = await db.query.slack.findFirst({
    where: eq(slack.slackAccessToken, slack_access_token),
    with: {
      connections: true,
    },
  });

  if (!slackConnection) {
    await db.transaction(async (tx) => {
      await tx
        .insert(slack)
        .values({
          userId: user_id,
          appId: app_id,
          authedUserId: authed_user_id,
          authedUserToken: authed_access_token,
          slackAccessToken: slack_access_token,
          botUserId: bot_user_id,
          teamId: team_id,
          teamName: team_name,
        })
        .returning();

      await tx.insert(connections).values({
        userId: user_id,
        type: "Slack",
      });
    });
  }
};

export const getSlackConnection = async () => {
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
    return await db.query.slack.findFirst({
      where: eq(slack.userId, user.id),
    });
  }

  return null;
};

export async function listBotChannels(
  slackAccessToken: string
): Promise<Option[]> {
  const url = `https://slack.com/api/conversations.list?${new URLSearchParams({
    types: "public_channel,private_channel",
    limit: "200",
  })}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${slackAccessToken}`,
      },
    });

    const data = await response.json();

    if (!data.ok) throw new Error(data.error);

    if (!data?.channels?.length) return [];

    return data.channels
      .filter((ch: any) => ch.is_member)
      .map((ch: any) => {
        return { label: ch.name, value: ch.id };
      });
  } catch (error: any) {
    console.error(`Error listing bot channels:, ${error.message}`);
    throw error;
  }
}

const postMessageInSlackChannel = async (
  slackAccessToken: string,
  slackChannel: string,
  content: string
): Promise<void> => {
  try {
    const url = "https://slack.com/api/chat.postMessage";
    const data = {
      channel: slackChannel,
      text: content,
    };

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${slackAccessToken}`,
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    //check if request for successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Slack API error: ${errorData.error || response.statusText}`
      );
    }
    console.log(`Message posted successfully to channel ID: ${slackChannel}`);
  } catch (error: any) {
    console.error(
      `Error posting message to Slack channel ${slackChannel}`,
      error?.response?.data || error.message
    );
  }
};

//wrapper function to post messagees to multiple slack channels
export const postMessageToSlack = async (
  slackAccessToken: string,
  selectedSlackChannels: Option[],
  content: string
): Promise<{ message: string }> => {
  if (!content) return { message: "Content is empty" };
  if (!selectedSlackChannels?.length)
    return { message: "Channel not selected" };

  try {
    selectedSlackChannels
      .map((channel) => channel?.value)
      .forEach((channel) => {
        postMessageInSlackChannel(slackAccessToken, channel, content);
      });
  } catch (error) {
    return { message: "Message could not be sent to Slack" };
  }

  return { message: "Success" };
};
