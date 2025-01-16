"use server";

import { users } from "@/db/schema";
import { auth } from "../../auth";
import { db } from "@/db/index";
import { eq } from "drizzle-orm";

const deleteUser = async (userId: string) => {
  await db.delete(users).where(eq(users.id, userId));
};

const deleteAccountAction = async () => {
  const session = await auth();

  if (!session?.user || typeof session.user.id !== "string") {
    throw new Error("You must be logged in to delete your account");
  }

  await deleteUser(session.user.id);
};

const getUserInfo = async () => {
  const session = await auth();

  if (!session || !session.user) {
    return undefined; //if there's no session or user
  }

  const user = session.user;

  return user;
};

export default deleteAccountAction;
