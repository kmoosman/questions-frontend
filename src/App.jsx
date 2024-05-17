import React, { useEffect } from "react";
import { Routes, Route, useLocation, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import "./css/style.css";

import "./charts/ChartjsConfig";

// Import pages
import Dashboard from "./pages/Dashboard";
import Privacy from "./pages/Privacy";

const queryClient = new QueryClient();

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/:id" element={<Dashboard type="collection" />} />
          <Route path="/privacy" element={<Privacy />} />
          {/* <Route path="/visualizations" element={<Visual type="visualizations" />} /> */}
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
