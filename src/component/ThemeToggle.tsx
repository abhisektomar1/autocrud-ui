import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { logEvent } from "./analytics";

// Define a type for the theme
type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    if (theme === "light") {
      logEvent({
        category: "theme",
        action: "light-theme-clicked",
      });
    } else {
      logEvent({
        category: "theme",
        action: "dark-theme-clicked",
      });
    }
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-full 
        bg-gray-200 darkk:bg-gray-700 
        text-gray-800 darkk:text-gray-200
        transition-all duration-300 ease-in-out
        hover:scale-110 
        active:scale-95
        ${theme === 'dark' ? 'rotate-180' : 'rotate-0'}
      `}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div className="transition-opacity duration-300 ease-in-out">
        {theme === "dark" ? (
          <Sun size={24} className="" />
        ) : (
          <Moon size={24} className="" />
        )}
      </div>
    </button>
  );
}