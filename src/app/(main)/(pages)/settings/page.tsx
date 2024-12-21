import ProfileForm from "@/components/forms/ProfileForm";
import ProfilePicture from "@/components/ProfilePicture";
import React from "react";
import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";

const Settings = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        <span className="tracking-tight">Settings</span>
      </h1>
      <div className="flex flex-col gap-10 p-6">
        <div>
          <h2 className="text-2xl font-semibold">User Profile</h2>
          <p className="text-base text-white/50">
            Add or update your information
          </p>
        </div>
        <ProfilePicture
          profileUrl={session.user?.image!}
          name={session?.user?.name!}
        />
        <ProfileForm user={session.user} />
      </div>
    </div>
  );
};

export default Settings;
