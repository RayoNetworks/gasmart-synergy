import Layout from "@/components/Layout";
import { Role } from "@/lib/types";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Reports from "@/pages/Reports";
import Sales from "@/pages/Sales";
import Settings from "@/pages/Settings";
import { Route } from "react-router-dom";
import { ForgetPassword, Login } from "./pages/auth";
const getAdminRoutes = (role: Role) => (
  // NOTE, there is no need for the / in the nested routes, because router-dom, addes it.
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


const getAuthRoutes = () => (
  <Route>
    <Route path="/login" element={<Login />} />
    <Route path="/forgot-password" element={<ForgetPassword />} />
  </Route>
);
export { getAdminRoutes, getAuthRoutes };
