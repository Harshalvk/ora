"use client";
import React, { useEffect } from "react";
import ConnectionCard from "@/app/(main)/(pages)/connections/_components/ConnectionCard";
import { AccordionContent } from "@/components/ui/accordion";
import MultipleSelector from "@/components/ui/multiple-selector";
import { Connection } from "@/lib/types";
import { useNodeConnections } from "@/providers/ConnectionsProvider";
import { EditorState } from "@/providers/EditorProvider";
import { useOraStore } from "@/store";

const RenderConnectionAccordion = ({
  connection,
  state,
}: {
  connection: Connection;
  state: EditorState;
}) => {
  const {
    title,
    image,
    description,
    connectionKey,
    accessTokenKey,
    slackSpecial,
  } = connection;

  const { nodeConnection } = useNodeConnections();
  const { slackChannels, selectedSlackChannels, setSelectedSlackChannels } =
    useOraStore();

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const connectionData = (nodeConnection as any)[connectionKey];

  const isConnected =
    (nodeConnection[connectionKey] &&
      accessTokenKey &&
      connectionData[accessTokenKey!]);

  return (
    <AccordionContent key={title}>
      {state.editor.selectedNode.data.title === title && (
        <>
          <ConnectionCard
            title={title}
            icon={image}
            description={description}
            type={title}
            connected={{ [title]: isConnected }}
          />
          {slackSpecial && isConnected && (
            <div className="p-6">
              {slackChannels?.length ? (
                <>
                  <div className="mb-4 ml-1">
                    Select the slack channels to send notification and messages:
                  </div>
                  <MultipleSelector
                    value={selectedSlackChannels}
                    onChange={setSelectedSlackChannels}
                    defaultOptions={slackChannels}
                    placeholder="Select channels"
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        no results found.
                      </p>
                    }
                  />
                </>
              ) : (
                "No Slack channels found. Please add your Slack bot to your Slack channel"
              )}
            </div>
          )}
        </>
      )}
    </AccordionContent>
  );
};

export default RenderConnectionAccordion;
