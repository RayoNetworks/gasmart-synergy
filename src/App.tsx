import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Products from "./pages/Products";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ConfirmRole from "./pages/ConfirmRole";
import { Role } from "./lib/types";

const queryClient = new QueryClient();

// Helper component to create role-based routes
const RoleBasedRoutes = ({ role }: { role: Role }) => (
  <Route path={`/${role}`} element={<Layout />}>
    <Route index element={<Dashboard />} />
    <Route path="sales" element={<Sales />} />
    <Route path="sales/return" element={<div>Sale Return</div>} />
    <Route path="sales/quotation" element={<div>Quotation</div>} />
    <Route path="products" element={<Products />} />
    <Route path="products/variation" element={<div>Product Variation</div>} />
    <Route path="reports" element={<Reports />} />
    <Route path="stock/adjustment" element={<div>Stock Adjustment</div>} />
    <Route path="stock/transfer" element={<div>Stock Transfer</div>} />
    <Route path="crm/users" element={<div>User List</div>} />
    <Route path="locations" element={<div>Locations</div>} />
    <Route path="settings" element={<Settings />} />
  </Route>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public route for role confirmation */}
          <Route path="/confirm-role" element={<ConfirmRole />} />
          
          {/* Role-based routes */}
          <RoleBasedRoutes role="admin" />
          <RoleBasedRoutes role="cashier" />
          <RoleBasedRoutes role="auditor" />

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