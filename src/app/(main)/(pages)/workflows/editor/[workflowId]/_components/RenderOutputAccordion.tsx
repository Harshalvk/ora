import { ConnectionProviderProps } from "@/providers/ConnectionsProvider";
import { EditorState } from "@/providers/EditorProvider";
import { useOraStore } from "@/store";
import React from "react";
import ContentBasedOnTitle from "./ContentBasedOnTitle";

type Props = {
  state: EditorState;
  nodeConnection: ConnectionProviderProps;
};

const RenderOutputAccordion = ({ state, nodeConnection }: Props) => {
  const {
    googleFile,
    setGoogleFile,
    selectedSlackChannels,
    setSelectedSlackChannels,
  } = useOraStore();

  return (
    <ContentBasedOnTitle
      nodeConnection={nodeConnection}
      newState={state}
      file={googleFile}
      setFile={setGoogleFile}
      selectedSlackChannels={selectedSlackChannels}
      setSelectedSlackChannels={setSelectedSlackChannels}
    />
  );
};

export default RenderOutputAccordion;
