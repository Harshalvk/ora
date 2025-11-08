"use server";

import { db } from "@/db/index";
import { workflows } from "@/db/schema";
import { eq } from "drizzle-orm";

export const onCreateNodesEdges = async (
  flowId: string,
  nodes: string,
  edges: string,
  flowPath: string
) => {
  const flow = await db
    .update(workflows)
    .set({ nodes, edges, flowPath })
    .where(eq(workflows.id, flowId));

  if (flow) return { message: "flow saved" };
};

export const onFlowPublish = async (workflowId: string, state: boolean) => {
  const published = await db
    .update(workflows)
    .set({ publish: state })
    .where(eq(workflows.id, workflowId));

  if (published) return "Workflow published";
  return "Workflow unpublished";
};

export const onGetNodesEdges = async (workflowId: string) => {
  const nodeEdgesDBFetch = await db
    .select({
      nodes: workflows.nodes,
      edges: workflows.edges,
    })
    .from(workflows)
    .where(eq(workflows.id, workflowId));

  const nodeEdges = nodeEdgesDBFetch[0];

  if (nodeEdges.nodes && nodeEdges.edges) return nodeEdges;
};
