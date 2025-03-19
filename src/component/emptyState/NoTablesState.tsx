/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Table2, Import, FileSpreadsheet } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import CreateTableDialog from "../modals/CreateTable";
import { TooltipProvider } from "@/components/ui/tooltip";

interface NoTablesStateProps {
  workspaceId: any; // Add workspaceId prop
}

const NoTablesState: React.FC<NoTablesStateProps> = ({ workspaceId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="h-[80vh] flex flex-col items-center justify-center p-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Content */}
      <motion.div variants={item} className="relative">
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <Table2 className="h-10 w-10 text-primary" />
        </div>
      </motion.div>

      <motion.h2
        variants={item}
        className="text-2xl font-semibold text-gray-900 mb-3 text-center"
      >
        No Tables Yet
      </motion.h2>

      <motion.p
        variants={item}
        className="text-gray-500 mb-8 text-center max-w-md"
      >
        Get started by creating your first table or import existing data to
        begin organizing your information.
      </motion.p>

      <motion.div
        variants={item}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full"
      >
        <Button
          onClick={() => setIsDialogOpen(true)} // Open the dialog on button click
          className="flex items-center justify-center gap-2 h-24 bg-primary/10 hover:bg-primary/20 text-primary relative"
        >
          <Plus className="h-5 w-5" />
          <div className="text-left">
            <div className="font-semibold">Create Table</div>
            <div className="text-sm opacity-80">Start from scratch</div>
          </div>
        </Button>

        <div className="relative">
          <Button
            variant="outline"
            disabled
            className="flex items-center justify-center gap-2 h-24 border-dashed w-full opacity-75"
          >
            <Import className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Import Data</div>
              <div className="text-sm opacity-80">CSV, Excel, or JSON</div>
            </div>
          </Button>
          <Badge 
            variant="secondary" 
            className="absolute -top-2 -right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full"
          >
            Coming Soon
          </Badge>
        </div>

        <div className="relative">
          <Button
            variant="outline"
            disabled
            className="flex items-center justify-center gap-2 h-24 border-dashed w-full opacity-75"
          >
            <FileSpreadsheet className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Use Template</div>
              <div className="text-sm opacity-80">Start with a template</div>
            </div>
          </Button>
          <Badge 
            variant="secondary" 
            className="absolute -top-2 -right-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full"
          >
            Coming Soon
          </Badge>
        </div>
      </motion.div>

      {/* CreateTableDialog */}
    <div className="hidden">
    <TooltipProvider>

    <CreateTableDialog
        isCollapsed={isDialogOpen}
        workspaceId={workspaceId}
        onClose={() => setIsDialogOpen(false)} // Close the dialog
        table={null} // Pass null or the table data if editing
      />
      </TooltipProvider>
    </div>
    
    </motion.div>
  );
};

export default NoTablesState;