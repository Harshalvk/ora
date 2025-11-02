"use server";

import { db } from "@/db/index";
import { auth } from "../../../../../../auth";
import { eq } from "drizzle-orm";
import { discordWebhook, connections } from "@/db/schema";

export const onDiscordConnect = async (
  channel_id: string,
  webhook_id: string,
  webhook_name: string,
  webhook_url: string,
  id: string,
  guild_name: string,
  guild_id: string
) => {
  //check if webhook id params set
  if (webhook_id) {
    //check if webhook exists in database with userID
    const webhook = await db.query.discordWebhook.findFirst({
      where: eq(discordWebhook.userId, id),
      with: {
        connections: true,
      },
    });

    //if webhook does not exists for current user
    if (!webhook) {
      //create new webhook
      await db.transaction(async (tx) => {
        //strep 1: create discordWebhook record
        const newWebHook = await tx
          .insert(discordWebhook)
          .values({
            userId: id,
            webhookId: webhook_id,
            channelId: channel_id,
            guildId: guild_id,
            name: webhook_name,
            url: webhook_url,
            guildName: guild_name,
          })
          .returning(); //returns newly created webhook

        //step 2: create the related connections record
        await tx.insert(connections).values({
          userId: id,
          type: "Discord",
          discordWebhookId: newWebHook[0].id, // use the ID of newly craeated webhook
        });
      });
    }

    //if webhook exists return check for duplicate
    if (webhook) {
      //check if webhhok existst for target channel id
      const webhook_channel = await db.query.discordWebhook.findFirst({
        where: eq(discordWebhook.channelId, channel_id),
        with: {
          connections: true,
        },
      });

      //if no webhook for channel then create new webhook
      if (!webhook_channel) {
        await db.transaction(async (tx) => {
          //strep 1: create discordWebhook record
          const newWebHook = await tx
            .insert(discordWebhook)
            .values({
              userId: id,
              webhookId: webhook_id,
              channelId: channel_id,
              guildId: guild_id,
              name: webhook_name,
              url: webhook_url,
              guildName: guild_name,
            })
            .returning(); //returns newly created webhook

          //step 2: create the related connections record
          await tx.insert(connections).values({
            userId: id,
            type: "Discord",
            discordWebhookId: newWebHook[0].id, // use the ID of newly craeated webhook
          });
        });
      }
    }
  }
};

export const getDiscordConnectionUrl = async () => {
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
    const webhook = await db.query.discordWebhook.findFirst({
      where: eq(discordWebhook.userId, user.id),
    });

    return webhook;
  }
};

export const postContentToWebHook = async (content: string, url: string) => {
  if (content != "") {
    const postReqeust = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (postReqeust.ok) {
      return { message: "success" };
    }

    return { message: "failed request" };
  }

  return { message: "String empty" };
};
