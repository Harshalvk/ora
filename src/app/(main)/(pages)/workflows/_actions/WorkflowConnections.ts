"use server";

import { eq } from "drizzle-orm";
import { auth } from "../../../../../../auth";
import { db } from "@/db/index";
import { users } from "@/db/schema";

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

    if(listener) return listener
  }
};
