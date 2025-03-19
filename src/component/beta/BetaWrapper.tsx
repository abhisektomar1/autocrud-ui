import React from "react";
import FloatingBetaTag from "./betaTag";
import { create } from "zustand";

interface BetaState {
  isBetaVisible: boolean;
  setIsBetaVisible: (visible: boolean) => void;
}

export const useBetaStore = create<BetaState>((set) => ({
  isBetaVisible: true,
  setIsBetaVisible: (visible) => set({ isBetaVisible: visible }),
}));

interface BetaTagWrapperProps {
  children: React.ReactNode;
  version?: string;
  tooltipText?: string;
  onFeedbackClick?: () => void;
}

const BetaTagWrapper: React.FC<BetaTagWrapperProps> = ({
  children,
  version,
  tooltipText,
  onFeedbackClick,
}) => {
  const { isBetaVisible } = useBetaStore();

  return (
    <div className="relative">
      {children}
      {isBetaVisible && (
        <FloatingBetaTag
          version={version}
          tooltipText={tooltipText}
          onFeedbackClick={onFeedbackClick}
        />
      )}
    </div>
  );
};

export default BetaTagWrapper;
