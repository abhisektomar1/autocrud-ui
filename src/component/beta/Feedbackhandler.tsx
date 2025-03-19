import React from "react";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Mail, ExternalLink } from "lucide-react";
import { toast } from "react-toastify";

interface FeedbackHandlerProps {
  version?: string;
  productName?: string;
  children: React.ReactNode;
}

const FeedbackHandler: React.FC<FeedbackHandlerProps> = ({
  version = "1.0.0-beta",
  productName = "AutoCRUD",
  children,
}) => {
  const handleEmailSupport = () => {
    const subject = encodeURIComponent(
      `${productName} Beta Feedback - v${version}`
    );
    const body = encodeURIComponent(`
Hi AutoCRUD Team,

I'm using ${productName} Beta (v${version}) and would like to provide feedback:

Type of Feedback:
- [ ] Bug Report
- [ ] Feature Request
- [ ] General Feedback

Description:


Environment:
- Browser: ${navigator.userAgent}
- OS: ${navigator.platform}

Best regards,
    `);

    window.location.href = `mailto:support@autocrud.com?subject=${subject}&body=${body}`;

    toast.success("Opening email client...", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-72 p-3" side="top" align="end">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="space-y-2"
        >
          <h3 className="font-medium text-sm mb-3">
            How would you like to provide feedback?
          </h3>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              className="w-full justify-start text-sm"
              onClick={handleEmailSupport}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Support
              <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
            </Button>
          </motion.div>

          <p className="text-xs text-muted-foreground mt-4">
            Your feedback helps us improve {productName}. Thank you for being a
            beta tester!
          </p>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};

export default FeedbackHandler;
