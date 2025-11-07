"use server";

import { eq } from "drizzle-orm";
import { auth } from "../../../../../../auth";
import { db } from "@/db";
import { connections, users } from "@/db/schema";

export const getGoogleDriveConnection = async () => {
  const session = await auth();

  if (!session || !session.user) {
    return null;
  }

  if (session.user.id) {
    const dbFetch = await db
      .select({
        driveConnected: connections.driveConnected,
        
      })
      .from(connections)
      .where(eq(connections.userId, session.user.id));

    return dbFetch[0].driveConnected;
  }

  return null;
};
