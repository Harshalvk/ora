"use client";

import { usePathname } from "next/navigation";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { menuOptions } from "@/lib/constants";
import Link from "next/link";
import clsx from "clsx";
import { Separator } from "./ui/separator";
import {
  Database,
  GitBranch,
  LucideMousePointerClick,
  Sparkles,
} from "lucide-react";
import { ModeToggle } from "./ModeToggle";

type Props = {};

const Sidebar = (props: Props) => {
  const pathName = usePathname();
  return (
    <nav className="dark:bg-black h-screen overflow-scroll justify-between flex flex-col gap-10 py-6 px-2 no-scrollbar">
      <div className="flex items-center justify-center flex-col gap-4">
        <h1 className="my-3">ora.</h1>
        <TooltipProvider>
          {menuOptions.map((menuItem, index) => (
            <ul key={menuItem.name}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <li>
                    <Link
                      href={menuItem.href}
                      className={clsx(
                        "group flex items-center justify-center rounded-lg p-[3px] cursor-pointer",
                        {
                          "dark:bg-neutral-800 bg-white":
                            pathName === menuItem.href,
                        }
                      )}
                    >
                      <menuItem.Component
                        onSelect={() => {
                          pathName === menuItem.href;
                        }}
                        className=""
                        size={24}
                      />
                    </Link>
                  </li>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="dark:bg-black/10 backdrop-blur-xl"
                >
                  <p>{menuItem.name}</p>
                </TooltipContent>
              </Tooltip>
            </ul>
          ))}
        </TooltipProvider>
        <Separator />
        <div className="flex items-center flex-col gap-9 dark:bg-neutral-800 py-4 px-2 rounded-full h-56 overflow-scroll border-[1px] no-scrollbar">
          <div className="relative dark:bg-neutral-700/70 p-2 rounded-full dark:border-t-[2xl] border-[1px] dark:border-t-neutral-700">
            <LucideMousePointerClick className={"dark:text-white"} size={18} />
            <div className="border-l-2 border-muted-foreground/50 h-6 absolute left-1/2 transform translate-x-[-50%] -bottom-[30px]" />
          </div>
          <div className="relative dark:bg-neutral-700/70 p-2 rounded-full dark:border-t-[2xl] border-[1px] dark:border-t-neutral-700">
            <GitBranch className={"dark:text-white"} size={18} />
            <div className="border-l-2 border-muted-foreground/50 h-6 absolute left-1/2 transform translate-x-[-50%] -bottom-[30px]" />
          </div>
          <div className="relative dark:bg-neutral-700/70 p-2 rounded-full dark:border-t-[2xl] border-[1px] dark:border-t-neutral-700">
            <Database className={"dark:text-white"} size={18} />
            <div className="border-l-2 border-muted-foreground/50 h-6 absolute left-1/2 transform translate-x-[-50%] -bottom-[30px]" />
          </div>
          <div className="relative dark:bg-neutral-700/70 p-2 rounded-full dark:border-t-[2xl] border-[1px] dark:border-t-neutral-700">
            <Sparkles className={"dark:text-white"} size={18} />
          </div>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-center">
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Sidebar;
