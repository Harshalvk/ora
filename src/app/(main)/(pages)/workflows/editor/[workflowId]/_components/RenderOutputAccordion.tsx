import { ConnectionProviderProps } from "@/providers/ConnectionsProvider";
import { EditorState } from "@/providers/EditorProvider";
import { useOraStore } from "@/store";
import ContentBasedOnTitle from "./ContentBasedOnTitle";
import { GoogleFileType } from "@/lib/types";

type Props = {
  state: EditorState;
  nodeConnection: ConnectionProviderProps;
};

const RenderOutputAccordion = ({ state, nodeConnection }: Props) => {
  const {
    googleFiles,
    setGoogleFiles,
    selectedSlackChannels,
    setSelectedSlackChannels,
  } = useOraStore();

  return (
    <ContentBasedOnTitle
      nodeConnection={nodeConnection}
      newState={state}
      files={googleFiles}
      setFiles={setGoogleFiles}
      selectedSlackChannels={selectedSlackChannels}
      setSelectedSlackChannels={setSelectedSlackChannels}
    />
  );
};

export default RenderOutputAccordion;
