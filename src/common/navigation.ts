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
      { name: "Products List", href: "/products", icon: ClipboardList },
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
      { name: "Manage Stock", href: "/admin/reports?tab=stock", icon: Database },
      {
        name: "Stock Adjustment",
        href: "/admin/stock/adjustment",
        icon: RefreshCw,
      },
      { name: "Stock Transfer", href: "/admin/stock/transfer", icon: Send },
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
      { name: "Customers", href: "/admin/reports?tab=crm", icon: Users },
      { name: "User List", href: "/admin/crm/users", icon: UserPlus },
      { name: "Staff", href: "/admin/crm/staff", icon: UserPlus },
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
      { name: "Locations", href: "/admin/locations", icon: MapPin },
      { name: "Branch", href: "/admin/branch", icon: MapPin },
    ],
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];



export default navigation;
