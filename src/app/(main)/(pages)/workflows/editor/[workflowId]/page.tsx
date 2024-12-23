import EditorProvider from "@/providers/EditorProvider";
import React from "react";

type Props = {
  params: {
    workflowId: string;
  };
};

const page = async ({ params }: Props) => {
  const { workflowId } = await params;

  return (
    <div className="h-full">
      <EditorProvider>
        <div></div>
      </EditorProvider>
    </div>
  );
};

export default page;
