import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export default NextAuth(authConfig).auth;

export async function proxy(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.redirect("/");
  }

  return NextResponse.redirect(req.nextUrl);
}

export const config = {
  matcher: ["/dashboard", "/connections", "/workflows", "/settings"],
};
