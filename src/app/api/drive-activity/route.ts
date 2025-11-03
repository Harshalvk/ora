import { google } from "googleapis";
import { auth } from "../../../../auth";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { accounts, users } from "@/db/schema";
import { v4 } from "uuid";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: "user session not found" });
    }

    if (!session?.user) {
      return NextResponse.json({ message: "user not found" });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.AUTH_GOOGLE_ID,
      process.env.AUTH_GOOGLE_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const fetchToken = await db
      .select({
        token: accounts.access_token,
      })
      .from(accounts)
      .where(eq(accounts.userId, session.user.id!));

    const { token } = fetchToken[0];

    oauth2Client.setCredentials({
      access_token: token,
    });

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });
    const channelId = v4();

    const pageTokenResponse = await drive.changes.getStartPageToken();
    const startPageToken = pageTokenResponse.data.startPageToken;

    if (startPageToken === null) {
      throw new Error("startPageToken is unexpectedly null");
    }

    const listner = await drive.changes.watch({
      pageToken: startPageToken,
      supportsAllDrives: true,
      supportsTeamDrives: true,
      requestBody: {
        id: channelId,
        type: "web_hook",
        address: process.env.NEXT_PUBLIC_NGROK_APP_URL,
        kind: "api#channel",
      },
    });

    if (listner.status === 200) {
      const channelStored = await db
        .update(users)
        .set({ googleResourceId: listner.data.resourceId })
        .where(eq(users.id, session.user.id!));

      if (channelStored) {
        return NextResponse.json({ message: "listening to changes..." });
      }
    }
  } catch (error) {
    console.error("failed to get drive information: ", error);
    return NextResponse.json(
      { message: "failed to get drive information" },
      { status: 401 }
    );
  }
}
