import Router from "./routes";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./styles/table.css";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { QueryClientProvider } from "react-query";
import ScrollToTop from "./utils/ScrollToTop";
import { ToastContainer } from "react-toastify";
import { queryClient } from "./queries/client";
import GAPageTracker from "./component/GAPageTracker";
import { initGA } from "./component/analytics";
import BetaTagWrapper from "./component/beta/BetaWrapper";
import "@xyflow/react/dist/style.css";
import { SearchProvider } from './context/SearchContext';

function App() {
  useAuthStore();
  useEffect(() => {
    initGA();
  }, []);
  const handleFeedbackClick = () => {
    // Handle feedback button click
   
  };
  return (
    <SearchProvider>
      <QueryClientProvider client={queryClient}>
        <ScrollToTop />
        <GAPageTracker />
        <BetaTagWrapper
          version="1.0.0-beta"
          tooltipText="This is a beta version. Help us improve by providing feedback!"
          onFeedbackClick={handleFeedbackClick}
        >
          <Router />
        </BetaTagWrapper>
        <ToastContainer position="bottom-right" autoClose={2000} />
      </QueryClientProvider>
    </SearchProvider>
  );
}

export default App;
