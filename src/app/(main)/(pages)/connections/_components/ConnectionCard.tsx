"use client";

import { ConnectionTypes } from "@/lib/types";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { GenerateDriveAuthUrl } from "../_actions/generate-drive-authurl";
import { useEffect, useState } from "react";

type Props = {
  type: ConnectionTypes;
  icon: string;
  title: ConnectionTypes;
  description: string;
  callback?: () => void;
  connected: {} & any;
};

const ConnectionCard = ({
  description,
  type,
  icon,
  title,
  connected,
}: Props) => {
  const [redirectUrl, setRedirectUrl] = useState("");

  const getRedirectUri = async () => {
    title == "Discord"
      ? setRedirectUrl(process.env.NEXT_PUBLIC_DISCORD_REDIRECT!)
      : title == "Notion"
        ? setRedirectUrl(process.env.NEXT_PUBLIC_NOTION_AUTH_URL!)
        : title == "Slack"
          ? setRedirectUrl(process.env.NEXT_PUBLIC_SLACK_REDIRECT!)
          : title === "Google Drive"
            ? setRedirectUrl(await GenerateDriveAuthUrl())
            : "#";
  };

  useEffect(() => {
    getRedirectUri();
  }, []);

  return (
    <Card className="flex w-full items-center justify-between">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <Image
            src={icon}
            alt={title}
            height={30}
            width={30}
            className="object-contain"
          />
        </div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <div className="flex flex-col items-center gap-2 p-4">
        {connected[type] ? (
          <div className="border-bg-primary rounded-lg border-2 px-3 py-2 font-bold">
            Connected
          </div>
        ) : (
          <Link
            href={redirectUrl}
            className=" rounded-lg bg-primary p-2 font-bold text-primary-foreground"
          >
            Connect
          </Link>
        )}
      </div>
    </Card>
  );
};

export default ConnectionCard;
