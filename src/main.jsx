import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import  AppThemeProvider  from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
      
<AppThemeProvider>
  <App />
</AppThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
