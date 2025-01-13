import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Products from "./pages/Products";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ConfirmRole from "./pages/ConfirmRole";
import { Role } from "./lib/types";
import { getAdminRoutes, getAuthRoutes, getCashierRoutes } from "./Routes";

const queryClient = new QueryClient();

// Define the routes configuration

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* this is for the auth page */}
          {getAuthRoutes()}
          {/* Public route for role confirmation */}
          <Route path="/confirm-role" element={<ConfirmRole />} />
          {/* Role-based routes */}
          {getAdminRoutes("admin")}
          {getCashierRoutes()}

          {/*{getRoutes("auditor")} */}

          {/* Redirect root to confirm-role */}
          <Route path="/" element={<Navigate to="/confirm-role" replace />} />

          {/* Catch all route - redirect to confirm-role */}
          <Route path="*" element={<Navigate to="/confirm-role" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
