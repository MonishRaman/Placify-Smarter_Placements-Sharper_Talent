import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; 
import { UserProvider } from './context/UserContext.jsx';

import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <AuthProvider> 
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </UserProvider>
  </StrictMode>
);
