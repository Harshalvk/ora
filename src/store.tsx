import { create } from "zustand";
import { GoogleFileType } from "./lib/types";

export interface Option {
  value: string;
  label: string;
  disable?: boolean;
  fixed?: boolean;
  [key: string]: string | boolean | undefined;
}

type OraStore = {
  googleFiles: GoogleFileType[];
  setGoogleFiles: (googleFile: GoogleFileType[]) => void;
  slackChannels: Option[];
  setSlackChannels: (slackChannels: Option[]) => void;
  selectedSlackChannels: Option[];
  setSelectedSlackChannels: (selectedSlackChannels: Option[]) => void;
};

export const useOraStore = create<OraStore>()((set) => ({
  googleFiles: [
    {
      id: "",
      kind: "",
      mimeType: "",
      name: "",
    },
  ],
  setGoogleFiles: (googleFiles: GoogleFileType[]) => set({ googleFiles }),
  slackChannels: [],
  setSlackChannels: (slackChannels: Option[]) => set({ slackChannels }),
  selectedSlackChannels: [],
  setSelectedSlackChannels: (selectedSlackChannels: Option[]) =>
    set({ selectedSlackChannels }),
}));
