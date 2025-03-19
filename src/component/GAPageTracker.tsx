import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { logPageView } from "./analytics";


const GAPageTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

export default GAPageTracker;