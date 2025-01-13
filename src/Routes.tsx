import { Role } from "@/lib/types";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import CreateProduct from "@/pages/CreateProduct";
import Reports from "@/pages/Reports";
import Sales from "@/pages/Sales";
import Settings from "@/pages/Settings";
import { Navigate, Route } from "react-router-dom";
import { ForgetPassword, Login, SetPassword } from "./pages/auth";
import { AdminLayout, AuthLayout } from "./layout";
import Customers from "./pages/Customers";
import EditCustomer from "./pages/EditCustomer";
import CustomerProducts from "./pages/CustomerProducts";
import Branch from "./pages/Branch";
import EditBranch from "./pages/EditBranch";
import CreateBranch from "./pages/CreateBranch";
import Outlets from "./pages/Outlets";
import UserList from "./pages/UserList";
import SalesReturn from "./pages/SalesReturn";
import Staff from "./pages/Staff";
import CreateStaff from "./pages/CreateStaff";
import EditStaff from "./pages/EditStaff";
import ProductCategories from "./pages/ProductCategories";
import ProductVariation from "./pages/ProductVariation";
import CreateProductVariation from "./pages/CreateProductVariation";
import ViewProductVariations from "./pages/ViewProductVariations";
import CreateOutlet from "./pages/CreateOutlet";
import EditOutlet from "./pages/CreateOutlet";
import BranchOutlets from "./pages/BranchOutlets";
import Managers from "./pages/Managers";
import CreateManager from "./pages/CreateManager";
import PumpManagement from "@/pages/PumpManagement";
import TankManagement from "./pages/TankManagement";
import LubricantsManagement from "./pages/LubricantsManagement";
import FuelProducts from "./pages/FuelProducts";
import FleetTracking from "./pages/FleetTracking";
import GeoFencing from "./pages/GeoFencing";
import FleetNotifications from "./pages/FleetNotifications";
import RoutePlanning from "./pages/RoutePlanning";

const getAdminRoutes = (role: Role) => (
  <Route path={`/${role}`} element={<AdminLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="sales" element={<Sales />} />
    <Route path="sales/return" element={<SalesReturn />} />
    <Route path="sales/quotation" element={<div>Quotation</div>} />
    <Route path="products" element={<Products />} />
    <Route path="products/create" element={<CreateProduct />} />
    <Route path="products/edit/:id" element={<CreateProduct />} />
    <Route path="products/variation" element={<ProductVariation />} />
    <Route path="products/lubricants" element={<LubricantsManagement />} />
    <Route path="products/fuel" element={<FuelProducts />} />
    <Route
      path="products/variation/:id/create"
      element={<CreateProductVariation />}
    />
    <Route
      path="products/variation/:id/view"
      element={<ViewProductVariations />}
    />
    <Route path="products/categories" element={<ProductCategories />} />
    <Route path="reports" element={<Reports />} />
    <Route path="stock/adjustment" element={<div>Stock Adjustment</div>} />
    <Route path="stock/transfer" element={<div>Stock Transfer</div>} />
    <Route path="assets/tanks" element={<TankManagement />} />
    <Route path="assets/pumps" element={<PumpManagement />} />
    <Route path="crm/users" element={<UserList />} />
    <Route path="crm/managers" element={<Managers />} />
    <Route path="crm/managers/create" element={<CreateManager />} />
    <Route path="crm/customers" element={<Customers />} />
    <Route path="crm/customers/:id/edit" element={<EditCustomer />} />
    <Route path="crm/customers/:id/products" element={<CustomerProducts />} />
    <Route path="crm/staff" element={<Staff />} />
    <Route path="crm/staff/create" element={<CreateStaff />} />
    <Route path="crm/staff/:id/edit" element={<EditStaff />} />
    <Route path="outlets" element={<Outlets />} />
    <Route path="outlets/create" element={<CreateOutlet />} />
    <Route path="outlets/:id/edit" element={<EditOutlet />} />
    <Route path="branch" element={<Branch />} />
    <Route path="branch/create" element={<CreateBranch />} />
    <Route path="branch/:id/edit" element={<EditBranch />} />
    <Route path="branch/:id/outlets" element={<BranchOutlets />} />
    <Route path="settings" element={<Settings />} />
    <Route path="fleet/tracking" element={<FleetTracking />} />
    <Route path="fleet/geofencing" element={<GeoFencing />} />
    <Route path="fleet/notifications" element={<FleetNotifications />} />
    <Route path="fleet/routes" element={<RoutePlanning />} />
  </Route>
);

const getCashierRoutes = () => (
  <Route path="/cashier" element={<Navigate to={"/"} />}>
    {/* // generate all cashier routes and pages but ask me for ui pictures inspiration first so I can clearify it for you */}
  </Route>
);
const getAuthRoutes = () => (
  <Route element={<AuthLayout />}>
    <Route path="/login" element={<Login />} />
    <Route path="/forgot-password" element={<ForgetPassword />} />
    <Route path="/set-password" element={<SetPassword />} />
  </Route>
);

export { getAdminRoutes, getCashierRoutes, getAuthRoutes };
