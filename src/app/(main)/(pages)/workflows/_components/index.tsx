import React from "react";
import Workflow from "./Workflow";
import { onGetWorkflows } from "../_actions/WorkflowConnections";

type Props = {};

const Workflows = async (props: Props) => {
  const workflows = await onGetWorkflows();
  
  return (
    <div className="relative flex flex-col gap-4">
      <section className="flex flex-col m-2">
        {workflows?.length ? (
          workflows.map((workflow) => (
            <Workflow
              key={workflow.id}
              description={workflow.description}
              name={workflow.name}
              id={workflow.id}
              publish={workflow.publish}
            />
          ))
        ) : (
          <div className="text-center text-muted-foreground text-2xl mt-8 tracking-tight">
            No Workflows
          </div>
        )}
      </section>
    </div>
  );
};

export default Workflows;
