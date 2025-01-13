import {
  Building2,
  UserPlus,
  ClipboardList,
  ArrowUpDown,
  Send,
  Heart,
  RefreshCw,
  FileText,
  MapPin,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Database,
  Users,
  BarChart3,
  Settings,
  GitBranch,
  Boxes,
  Fuel,
  Gauge,
  Flask,
  Droplet,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    header: "Manage Product",
    name: "Products",
    icon: Package,
    subroutes: [
      { name: "Products List", href: "/admin/products", icon: ClipboardList },
      {
        name: "Product Categories",
        href: "/admin/products/categories",
        icon: ArrowUpDown,
      },
      {
        name: "Lubricants & Oils",
        href: "/admin/products/lubricants",
        icon: Flask,
      },
      {
        name: "Fuel Products",
        href: "/admin/products/fuel",
        icon: Droplet,
      },
      {
        name: "Product Variation",
        href: "/admin/products/variation",
        icon: ArrowUpDown,
      },
    ],
  },
  {
    header: "Manage Stock",
    name: "Stock",
    icon: Database,
    subroutes: [
      {
        name: "Manage Stock",
        href: "/admin/reports?tab=stock",
        icon: Database,
      },
      {
        name: "Stock Adjustment",
        href: "/admin/stock/adjustment",
        icon: RefreshCw,
      },
      { name: "Stock Transfer", href: "/admin/stock/transfer", icon: Send },
    ],
  },
  {
    header: "Asset Management",
    name: "Assets",
    icon: Boxes,
    subroutes: [
      {
        name: "Tank Management",
        href: "/admin/assets/tanks",
        icon: Fuel,
      },
      {
        name: "Pump Management",
        href: "/admin/assets/pumps",
        icon: Gauge,
      },
    ],
  },
  {
    header: "Manage Sale",
    name: "Sales",
    icon: ShoppingCart,
    subroutes: [
      { name: "Sales", href: "/admin/sales", icon: Heart },
      { name: "Sale Return", href: "/admin/sales/return", icon: RefreshCw },
      { name: "Quotation", href: "/admin/sales/quotation", icon: FileText },
    ],
  },
  {
    header: "CRM",
    name: "CRM",
    icon: Users,
    subroutes: [
      { name: "Customers", href: "/admin/crm/customers", icon: Users },
      { name: "User List", href: "/admin/crm/users", icon: UserPlus },
      { name: "Staff", href: "/admin/crm/staff", icon: UserPlus },
      { name: "Managers", href: "/admin/crm/managers", icon: UserPlus },
    ],
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    header: "General Module",
    name: "General",
    icon: Building2,
    subroutes: [
      { name: "Outlets", href: "/admin/outlets", icon: MapPin },
      { name: "Branch", href: "/admin/branch", icon: GitBranch },
    ],
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default navigation;