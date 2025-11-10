import React from "react";
import { auth } from "../../../../../auth";
import { db } from "@/db";
import { Stripe } from "stripe";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type Props = {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
};

const Billing = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const { session_id } = params ?? {
    session_id: "",
  };

  const userSession = await auth();

  if (!userSession || !userSession.user) {
    return <p>Session Not found</p>;
  }

  if (session_id) {
    const stripe = new Stripe(process.env.STRIPE_SECRET!, {
      typescript: true,
      apiVersion: "2025-10-29.clover",
    });

    const session = await stripe.checkout.sessions.listLineItems(session_id);

    if (userSession.user) {
      await db
        .update(users)
        .set({
          tier: session.data[0].description,
          credits:
            session.data[0].description == "Unlimited"
              ? "Unlimited"
              : session.data[0].description == "Pro"
                ? "100"
                : "10",
        })
        .where(eq(users.id, userSession.user.id!));
    }
  }
  return (
    <section className="p-10 h-full">
      <div>
        <h1 className="text-3xl md:text-4xl">Billing</h1>
        <p className="text-muted-foreground text-base md:text-md">
          Manage your subscriptions, view payment history, and updat your
          billing <br className="hidden md:flex" />
          details — all in one place.
        </p>
      </div>
      <div>
        <h1>Subscription Overview</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3 border border-border rounded-3xl px-7 py-4 shadow-sm bg-muted-foreground/5">
            <h3 className="font-medium">Current Plan</h3>
            <div className="border-t" />
            <div className="flex items-center justify-between">
              <div className="flex flex-col justify-start gap-1">
                <div className="rounded-xl border w-fit px-3 py-1 bg-green-100">
                  <p className="font-semibold text-sm text-green-600">
                    Pro Plan
                  </p>
                </div>
                <p className="text-xl font-semibold">
                  $29{" "}
                  <span className="text-muted-foreground/80 font-normal text-sm">
                    / Month
                  </span>
                </p>
              </div>

              <Button className="rounded-xl border-4 border-zinc-700  bg-gradient-to-t from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-600 transition-all duration-300">
                Upgrade <Rocket />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-3 border border-border rounded-3xl px-7 py-4 shadow-sm bg-muted-foreground/5">
            <h3 className="font-medium">Usage summary</h3>
            <div className="border-t" />
            <div className="lg:flex justify-evenly gap-2">
              <div className="flex-1">
                <p>8,500 / 10,000</p>
                <div className="flex items-center gap-2">
                  <Progress value={60} className="w-full border h-2" />
                  <p className="text-sm">85%</p>
                </div>
                <p>API Requests Used</p>
              </div>
              <div className="flex-1">
                <p>200 / 1000</p>
                <div className="flex items-center gap-2">
                  <Progress
                    value={60}
                    className="w-full border h-2 [&>*]:bg-orange-500 inset-shadow-sm inset-shadow-indigo-500"
                  />
                  <p className="text-sm">85%</p>
                </div>
                <p>Credits Consumed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Billing;
