// File: src/utils/analytics.ts

// Replace with your Google Analytics 4 Measurement ID
// const GA_MEASUREMENT_ID = "G-FRC32DCRBV";

export const initGA = (): void => {
  // ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const logPageView = (path: string): void => {
  console.log("Page view:", path);
  // ReactGA.send({ hitType: "pageview", page: path });
};

interface EventProps {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export const logEvent = ({
  category,
  action,
  label,
  value,
}: EventProps): void => {
  console.log("Logging", category, action, label, value);
  // ReactGA.event({
  //   category,
  //   action,
  //   label,
  //   value,
  //   nonInteraction: true, // optional, true/false
  //   transport: "xhr", // optional, beacon/xhr/image
  // });
};

export const setUserProperties = (): void => {

  // ReactGA.set(properties);
};

// Usage in a component:
// File: src/components/SomeComponent.tsx

// import React from "react";
// import { logEvent, setUserProperties } from "../utils/analytics";

// interface SomeComponentProps {
//   // Add any props if needed
// }

// const SomeComponent: React.FC<SomeComponentProps> = () => {
//   const handleButtonClick = () => {
//     logEvent({
//       category: "User",
//       action: "Clicked Button",
//       label: "Get Started Button",
//       value: 1
//     });
//     // ... rest of your click handler
//   };

//   const handleLogin = (userId: string) => {
//     setUserProperties({
//       userId: userId,
//       userRole: "premium",
//     });
//     // ... rest of your login logic
//   };

//   return (
//     <div>
//       <button onClick={handleButtonClick}>Get Started</button>
//       {/* ... other component JSX */}
//     </div>
//   );
// };

// export default SomeComponent;
