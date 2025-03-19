import { ReactFlowProvider } from "@xyflow/react";
import ThreadNodeBuilder from "./page";

function AutomationPage() {
  return (
    <ReactFlowProvider>
      <ThreadNodeBuilder />
    </ReactFlowProvider>
  );
}

export default AutomationPage;
