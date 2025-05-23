import React from "react";
import StepLoader from "@/components/ui/StepLoader";

const Debug = () => {
  return (
    <div>
      <h1>Debug Page</h1>
      <StepLoader debug={true} />
    </div>
  );
};

export default Debug;
