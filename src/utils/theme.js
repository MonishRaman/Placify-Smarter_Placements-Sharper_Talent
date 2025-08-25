// Theme utility functions to prevent flash of incorrect theme

export const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      const isDarkTheme = savedTheme === "dark";
      // Ensure document class matches saved theme
      if (isDarkTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return isDarkTheme;
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemPrefersDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return systemPrefersDark;
    }
  }
  return false;
};

export const applyTheme = (isDark) => {
  localStorage.setItem("theme", isDark ? "dark" : "light");
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};
