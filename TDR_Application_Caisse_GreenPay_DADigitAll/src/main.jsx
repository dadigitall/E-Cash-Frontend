import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";

import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CompanyThemeProvider } from "./theme/CompanyThemeProvider";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider>
      <BrowserRouter>
        <AuthProvider>
          <CompanyThemeProvider>
            <App />
          </CompanyThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </HeroUIProvider>
  </StrictMode>,
);

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   </StrictMode>
// );
