"use client";

import { User } from "next-auth";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { signOut } from "../../../auth";
import { LogOut, UserX } from "lucide-react";
import deleteAccountAction from "@/app/action";

type Props = {
  user: Pick<User, "name" | "email" | "image">;
};

const UserAccount = ({ user }: Props) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-zinc-700 dark:text-zinc-400">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            signOut({
              redirectTo: "/",
            }).catch(console.error);
          }}
          className="dark:text-red-500 text-red-500 group cursor-pointer"
        >
          Sign Out{" "}
          <LogOut
            height={16}
            width={16}
            className="group-hover:translate-x-1 transition"
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await deleteAccountAction();
            signOut({ redirectTo: "/" });
          }}
        >
          <UserX />
          Delete Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccount;
