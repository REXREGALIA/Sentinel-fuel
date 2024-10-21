import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "sonner";
import AuthProvider from "./AuthContext.jsx";
createRoot(document.getElementById("root")).render(

  <StrictMode>
    <AuthProvider>
      <Toaster></Toaster>
      <App />
    </AuthProvider>
  </StrictMode>
);
