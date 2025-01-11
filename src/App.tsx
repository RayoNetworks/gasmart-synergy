import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Products from "./pages/Products";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ConfirmRole from "./pages/ConfirmRole";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* this is to confirm the user role from their token in local-storage */}
          <Route path="/confirm-role" element={<ConfirmRole />} />
{/*  */}
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/sales/return" element={<div>Sale Return</div>} />
            <Route path="/sales/quotation" element={<div>Quotation</div>} />
            <Route path="/products" element={<Products />} />
            <Route
              path="/products/variation"
              element={<div>Product Variation</div>}
            />
            <Route path="/reports" element={<Reports />} />
            <Route
              path="/stock/adjustment"
              element={<div>Stock Adjustment</div>}
            />
            <Route path="/stock/transfer" element={<div>Stock Transfer</div>} />
            <Route path="/crm/users" element={<div>User List</div>} />
            <Route path="/locations" element={<div>Locations</div>} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;