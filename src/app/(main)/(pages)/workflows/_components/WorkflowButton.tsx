"use client";

import CustomModal from "@/components/CustomModal";
import WorkflowForm from "@/components/forms/WorkflowForm";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/ModalProvider";
import { Plus } from "lucide-react";
import React from "react";

type Props = {};

const WorkflowButton = (props: Props) => {
  const { setClose, setOpen } = useModal();

  const handleClick = () => {
    setOpen(
      <CustomModal
        title="Create a Workflow Automation"
        subheading="Workflows are a powerfull that help you automate tasks."
      >
        <WorkflowForm />
      </CustomModal>
    );
  };

  return (
    <Button size={"icon"} onClick={handleClick}>
      <Plus />
    </Button>
  );
};

export default WorkflowButton;
