import { AccordionContent } from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { onContentChange } from "@/lib/editor-utils";
import { GoogleFileType, nodeMapper } from "@/lib/types";
import { ConnectionProviderProps } from "@/providers/ConnectionsProvider";
import { EditorState } from "@/providers/EditorProvider";
import { Option } from "@/store";
import GoogleFileDetails from "./GoogleFileDetails";
import GoogleDriveFiles from "./GoogleDriveFiles";
import ActionButton from "./ActionButton";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

type Props = {
  nodeConnection: ConnectionProviderProps;
  newState: EditorState;
  files: GoogleFileType[];
  setFiles: (files: GoogleFileType[]) => void;
  selectedSlackChannels: Option[];
  setSelectedSlackChannels: (value: Option[]) => void;
};

const ContentBasedOnTitle = ({
  nodeConnection,
  newState,
  files,
  setFiles,
  selectedSlackChannels,
  setSelectedSlackChannels,
}: Props) => {
  const { selectedNode } = newState.editor;
  const title = selectedNode.data.title;

  useEffect(() => {
    const reqGoogle = async () => {
      const res = await axios.get("/api/drive");
      if (res) {
        toast.message(JSON.stringify("File found"));
        setFiles(res.data.data.files);
      } else {
        toast.error("Something went wrong");
      }
    };

    reqGoogle();
  }, []);

  //@ts-ignore
  const nodeConnectionType: any = nodeConnection[nodeMapper[title]];
  if (!nodeConnectionType) return <p>Not connected</p>;

  const isConnected =
    title === "Google Drive"
      ? !nodeConnection.isLoading
      : !!nodeConnectionType[
          `${
            title === "Slack"
              ? "slackAccessToken"
              : title === "Discord"
                ? "webhookURL"
                : title === "Notion"
                  ? "accessToken"
                  : ""
          }`
        ];

  if (!isConnected) return <p>Not connected</p>;

  return (
    <AccordionContent>
      <Card>
        {title === "Discord" && (
          <CardHeader>
            <CardTitle>{nodeConnectionType.webhookName}</CardTitle>
            <CardDescription>{nodeConnectionType.guildName}</CardDescription>
          </CardHeader>
        )}
        <div className="flex flex-col gap-3 px-6 py-3 pb-20">
          <p>{title === "Notion" ? "Vallues to be stored" : "Message"}</p>
          {title === "Discord" || title === "Slack" ? (
            <Input
              type="text"
              value={nodeConnectionType.content}
              onChange={(event) =>
                onContentChange(nodeConnection, title, event)
              }
            />
          ) : null}
          {JSON.stringify(files) !== "[]" && title === "Google Drive" && (
            <Card className="w-full">
              <CardContent className="px-2 py-3">
                <div className="flex flex-col gap-4">
                  <CardDescription>Drive File</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {files?.map((file) => (
                      <GoogleFileDetails
                        nodeConnection={nodeConnection}
                        title={title}
                        gFile={file}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {title === "Google Drive" && <GoogleDriveFiles />}
          <ActionButton
            currentService={title}
            nodeConnection={nodeConnection}
            channels={selectedSlackChannels}
            setChannels={setSelectedSlackChannels}
          />
        </div>
      </Card>
    </AccordionContent>
  );
};

export default ContentBasedOnTitle;
