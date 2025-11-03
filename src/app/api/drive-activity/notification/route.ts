import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  discordWebhook,
  users,
  workflows as dbSchemaWorkflows,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { postContentToWebHook } from "@/app/(main)/(pages)/connections/_actions/discord-connection";
import { postMessageToSlack } from "@/app/(main)/(pages)/connections/_actions/slack-connection";
import { onCreateNewPageInDatabase } from "@/app/(main)/(pages)/connections/_actions/notion-connection";
import axios from "axios";

export async function POST(req: NextRequest) {
  const headersList = await headers();

  let channelResourceId;
  headersList.forEach((value, key) => {
    if (key === "x-goog-resource-id") {
      channelResourceId = value;
    }
  });

  if (channelResourceId) {
    const fetchUserCreditsDB = await db
      .select({ id: users.id, credits: users.credits })
      .from(users)
      .where(eq(users.googleResourceId, channelResourceId));

    const user = fetchUserCreditsDB[0];

    if ((user && parseInt(user.credits!) > 0) || user.credits === "Unlimited") {
      const workflows = await db.query.workflows.findMany({
        where: eq(users.id, user.id),
      });

      if (workflows) {
        workflows.map(async (workflow) => {
          const flowPath = JSON.parse(workflow.flowPath!);
          let current = 0;

          while (current < flowPath.length) {
            if (flowPath[current] === "Discord") {
              const fetchWebHookURL = await db
                .select({
                  url: discordWebhook.url,
                })
                .from(discordWebhook)
                .where(eq(users.id, workflow.userId!));
              const discordUrl = fetchWebHookURL[0];

              if (discordUrl) {
                await postContentToWebHook(
                  workflow.discordTemplate!,
                  discordUrl.url!
                );
                flowPath.splice(flowPath[current], 1);
              }
            }
            if (flowPath[current] === "Slack") {
              const channels = workflow.slackChannels?.map((channel) => {
                return {
                  lable: "",
                  value: channel,
                };
              });

              if (!channels) {
                return NextResponse.json({ message: "channel not found" });
              }
              await postMessageToSlack(
                workflow.slackAccessToken!,
                channels,
                workflow.slackTemplate!
              );
            }
            if (flowPath[current] === "Notion") {
              await onCreateNewPageInDatabase(
                workflow.notionDId!,
                workflow.notionAccessToken!,
                JSON.parse(workflow.notionTemplate!)
              );
            }
            if (flowPath[current] === "Wait") {
              const res = await axios.put(
                "https://api.cron-jobs.org/jobs",
                {
                  job: {
                    url: `${process.env.NEXT_PUBLIC_NGROK_APP_URL}?workflow_id=${workflow.id}`,
                    enable: true,
                    schedule: {
                      timezone: "Europe/Istanbul",
                      expiresAt: 0,
                      hours: [-1],
                      mdays: [-1],
                      minutes: ["*****"],
                      months: [-1],
                      wdays: [-1],
                    },
                  },
                },
                {
                  headers: {
                    Authorization: `Bearer ${process.env.CRON_JOB_API}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              if (res) {
                flowPath.splice(flowPath[current], 1);
                const cronPath = await db
                  .update(dbSchemaWorkflows)
                  .set({
                    cronPath: JSON.stringify(flowPath),
                  })
                  .where(eq(dbSchemaWorkflows.id, workflow.id));

                if (cronPath) break;
              }
              break;
            }
            current++;
          }

          // decreasing user credits
          await db
            .update(users)
            .set({
              credits: `${parseInt(user.credits!) - 1}`,
            })
            .where(eq(users.id, user.id));
        });

        return NextResponse.json(
          {
            message: "workflow completed",
          },
          { status: 200 }
        );
      }
    }
  }
  return NextResponse.json({ message: "success" }, { status: 200 });
}
