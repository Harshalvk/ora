import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  onCreateNodesEdges,
  onFlowPublish,
} from "../_actions/WorkConnectionsAction";
import { EditorNodeEdgesType, EditorNodeType } from "@/lib/types";

type Props = {
  children: React.ReactNode;
  edges: EditorNodeEdgesType[];
  nodes: EditorNodeType[];
};

const FlowInstance = ({ children, edges, nodes }: Props) => {
  const pathName = usePathname();
  const [isFlow, setIsFlow] = useState([]);

  const onFlowAutomation = useCallback(async () => {
    const flow = await onCreateNodesEdges(
      pathName.split("/").pop()!,
      JSON.stringify(nodes),
      JSON.stringify(edges),
      JSON.stringify(isFlow)
    );
    if (flow) toast.message(flow.message);
  }, [nodes, edges, isFlow, pathName]);

  const onPublishWorkflow = useCallback(async () => {
    const response = await onFlowPublish(pathName.split("/").pop()!, true);
    if (response) toast.message(response);
  }, []);

  const onAutomateFlow = async () => {
    const flows: any = [];
    const connectEdges = edges.map((edge) => edge.target);
    connectEdges.map((target) => {
      nodes.map((node) => {
        if (node.id === target) {
          flows.push(node.type);
        }
      });
    });
    setIsFlow(flows);
  };

  useEffect(() => {
    onAutomateFlow();
  }, [edges]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3 p-4">
        <Button onClick={onFlowAutomation} disabled={isFlow.length < 1}>
          Save
        </Button>
        <Button onClick={onPublishWorkflow} disabled={isFlow.length < 1}>
          Publish
        </Button>
      </div>
      {children}
    </div>
  );
};

export default FlowInstance;
