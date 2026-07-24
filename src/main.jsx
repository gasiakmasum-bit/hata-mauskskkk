import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { StoreProvider } from "./context/StoreContext.jsx";
import "./index.css";

function Root() {
  return (
    <HashRouter>
      <ToastProvider>
        <StoreProvider>
          <ScrollToTop />
          <App />
        </StoreProvider>
      </ToastProvider>
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
