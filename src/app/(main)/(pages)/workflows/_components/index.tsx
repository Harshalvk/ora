import React from "react";
import Workflow from "./Workflow";

type Props = {};

const Workflows = (props: Props) => {
  return (
    <div className="relative flex flex-col gap-4">
      <section className="flex flex-col m-2">
        <Workflow
          description="Creating a test workflow"
          name="Test workflow"
          id="kjfoijewa324fasdfj"
          publish={false}
        />
      </section>
    </div>
  );
};

export default Workflows;
