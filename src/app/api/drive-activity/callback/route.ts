import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { db } from "@/db";
import { accounts, connections } from "@/db/schema";
import { auth } from "../../../../../auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code)
      return NextResponse.json(
        { error: "no code found in callback" },
        { status: 400 }
      );

    const session = await auth();

    if (!session || !session.user) {
      throw new Error("session not found");
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.AUTH_GOOGLE_ID,
      process.env.AUTH_GOOGLE_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const tokens = await oauth2Client.getToken(code);

    if (!tokens) {
      throw new Error("Token not found");
    }

    Promise.all([
      db.update(accounts).set({
        access_token: tokens.tokens.access_token,
        refresh_token: tokens.tokens.refresh_token,
      }),
      db.insert(connections).values({
        userId: session.user.id,
        driveConnected: true,
        type: "Google Drive",
      }),
    ]);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_BASE_URL}/connections?status=success&connection=drive`
    );
  } catch (error) {
    console.error("error in drive-activity callback: ", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_BASE_URL}/connections?status=error&connection=drive`
    );
  }
}
