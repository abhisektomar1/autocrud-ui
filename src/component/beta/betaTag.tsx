import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import FeedbackHandler from "./Feedbackhandler";

interface FloatingBetaTagProps {
  className?: string;
  version?: string;
  tooltipText?: string;
  onFeedbackClick?: () => void;
}

const FloatingBetaTag: React.FC<FloatingBetaTagProps> = ({
  className,
  version = "1.0.0",
  // tooltipText = "This feature is in beta. Your feedback helps us improve!",
}) => {
  const baseStyles = "fixed bottom-4 right-4 z-50 flex items-center gap-2";

  const containerVariants = {
    initial: { y: 100, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.5,
      },
    },
    exit: {
      y: 100,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <AnimatePresence>
      <motion.div className={cn(baseStyles, className)}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit">
        <FeedbackHandler version={version} productName="AutoCRUD">
          <motion.div
            className={cn(
              "flex items-center gap-2 bg-white/10 backdrop-blur-md",
              "rounded-full shadow-lg border border-primary/20",
              "px-4 py-2 cursor-pointer hover:bg-primary/5 transition-colors",
              "text-sm font-medium text-primary"
            )}
            variants={pulseVariants}
            animate="animate"
          >
            <motion.div
              className="relative flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">BETA</span>

              <span className="ml-2 text-xs opacity-60">v{version}</span>

              <Info className="ml-2 h-4 w-4 opacity-60" />
            </motion.div>
          </motion.div>
        </FeedbackHandler>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingBetaTag;
