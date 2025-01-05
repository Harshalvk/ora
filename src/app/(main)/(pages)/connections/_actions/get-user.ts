"use server";

import { db } from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getUserData = async (id: string) => {
  const user_info = await db.query.users.findFirst({
    where: eq(users.id, id),
    with: {
      connections: true,
    },
  });

  return user_info;
};
