
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
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wifi, WifiOff } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Use stale data when offline
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <Alert className="fixed bottom-4 right-4 w-auto z-50 bg-yellow-50 border border-yellow-200 flex items-center gap-2">
      <WifiOff className="h-4 w-4 text-yellow-500" />
      <AlertDescription className="text-yellow-700">
        You're currently offline. Some features may be limited.
      </AlertDescription>
    </Alert>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NetworkStatus />
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
