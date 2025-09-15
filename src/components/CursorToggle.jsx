import React from "react";
import { useCursor } from "../context/CursorContext";
import { MousePointerClick } from "lucide-react";
import { motion } from "framer-motion";

const CursorToggle = () => {
  const { cursorEnabled, setCursorEnabled } = useCursor();

  return (
    <motion.button
      onClick={() => setCursorEnabled(!cursorEnabled)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
                 transition-all duration-200 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md will-change-transform ml-3"
      aria-label="Toggle animated cursor"
      title={cursorEnabled ? "Disable animated cursor" : "Enable animated cursor"}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: cursorEnabled ? 0 : 360,
          scale: cursorEnabled ? 1 : 0.8,
          opacity: cursorEnabled ? 1 : 0.5,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="w-5 h-5"
      >
        <MousePointerClick className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      </motion.div>

      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 hover:opacity-20 transition-opacity duration-200"
        style={{
          background: cursorEnabled
            ? "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(107, 114, 128, 0.3) 0%, transparent 70%)",
        }}
      />
    </motion.button>
  );
};

export default CursorToggle;
