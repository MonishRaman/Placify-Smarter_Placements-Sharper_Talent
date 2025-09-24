import React from "react";

const ResponsiveLayout = ({
  sidebar,
  main,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar (collapsible) */}
      <div
        className={`transition-all duration-300 h-full z-20 bg-white dark:bg-gray-800 border-r dark:border-gray-700 ${
          isSidebarOpen ? "w-80" : "w-0 min-w-0"
        }`}
        style={{ minWidth: isSidebarOpen ? 320 : 0 }}
      >
        <div className={isSidebarOpen ? "block h-full" : "hidden"}>
          {sidebar}
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Sidebar toggle button (always visible on mobile, floating on desktop) */}
        <button
          className="absolute top-4 left-4 z-30 p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:scale-105 transition md:hidden"
          onClick={onToggleSidebar}
        >
          <span className="sr-only">Toggle sidebar</span>
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-menu w-6 h-6 text-gray-700 dark:text-gray-200"
          >
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
        {/* Main content */}
        {main}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
