import { Role } from "@/lib/types";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import CreateProduct from "@/pages/CreateProduct";
import Reports from "@/pages/Reports";
import Sales from "@/pages/Sales";
import Settings from "@/pages/Settings";
import { Route } from "react-router-dom";
import { ForgetPassword, Login, SetPassword } from "./pages/auth";
import { AdminLayout, AuthLayout } from "./layout";
import Customers from "./pages/Customers";
import EditCustomer from "./pages/EditCustomer";
import CustomerProducts from "./pages/CustomerProducts";
import Branch from "./pages/Branch";
import EditBranch from "./pages/EditBranch";
import CreateBranch from "./pages/CreateBranch";
import Locations from "./pages/Locations";
import UserList from "./pages/UserList";
import SalesReturn from "./pages/SalesReturn";
import Staff from "./pages/Staff";
import CreateStaff from "./pages/CreateStaff";
import EditStaff from "./pages/EditStaff";
import ProductCategories from "./pages/ProductCategories";
import ProductVariation from "./pages/ProductVariation";

const getAdminRoutes = (role: Role) => (
  <Route path={`/${role}`} element={<AdminLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="sales" element={<Sales />} />
    <Route path="sales/return" element={<SalesReturn />} />
    <Route path="sales/quotation" element={<div>Quotation</div>} />
    <Route path="products" element={<Products />} />
    <Route path="products/create" element={<CreateProduct />} />
    <Route path="products/edit/:id" element={<CreateProduct />} />
    <Route path="products/variation/:id" element={<ProductVariation />} />
    <Route path="products/categories" element={<ProductCategories />} />
    <Route path="products/variation" element={<ProductVariation/>} />
    <Route path="reports" element={<Reports />} />
    <Route path="stock/adjustment" element={<div>Stock Adjustment</div>} />
    <Route path="stock/transfer" element={<div>Stock Transfer</div>} />
    <Route path="crm/users" element={<UserList />} />
    <Route path="crm/customers" element={<Customers />} />
    <Route path="crm/customers/:id/edit" element={<EditCustomer />} />
    <Route path="crm/customers/:id/products" element={<CustomerProducts />} />
    <Route path="crm/staff" element={<Staff />} />
    <Route path="crm/staff/create" element={<CreateStaff />} />
    <Route path="crm/staff/:id/edit" element={<EditStaff />} />
    <Route path="locations" element={<Locations />} />
    <Route path="branch" element={<Branch />} />
    <Route path="branch/create" element={<CreateBranch />} />
    <Route path="branch/:id/edit" element={<EditBranch />} />
    <Route path="settings" element={<Settings />} />
  </Route>
);

const getAuthRoutes = () => (
  <Route element={<AuthLayout />}>
    <Route path="/login" element={<Login />} />
    <Route path="/forgot-password" element={<ForgetPassword />} />
    <Route path="/set-password" element={<SetPassword />} />
  </Route>
);

export { getAdminRoutes, getAuthRoutes };