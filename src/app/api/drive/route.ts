import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { auth } from "../../../../auth";
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return { success: false, message: "user session not found" };
    }

    if (!session?.user) {
      return { success: false, message: "user not found" };
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

    const response = await drive.files.list();

    if (response) {
      return NextResponse.json({ data: response.data }, { status: 200 });
    }
  } catch (error) {
    console.error("drive api failed", error);
    return NextResponse.json(
      { data: "failed to fetch drive activity" },
      { status: 401 }
    );
  }
}
