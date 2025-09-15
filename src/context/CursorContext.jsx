import { createContext, useContext, useState } from "react";

const CursorContext = createContext();

export const CursorProvider = ({ children }) => {
  const [cursorEnabled, setCursorEnabled] = useState(true);

  return (
    <CursorContext.Provider value={{ cursorEnabled, setCursorEnabled }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);
