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
    href: "/",
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
        href: "/products/variation",
        icon: ArrowUpDown,
      },
    ],
  },
  {
    header: "Manage Stock",
    name: "Stock",
    icon: Database,
    subroutes: [
      { name: "Manage Stock", href: "/reports?tab=stock", icon: Database },
      {
        name: "Stock Adjustment",
        href: "/stock/adjustment",
        icon: RefreshCw,
      },
      { name: "Stock Transfer", href: "/stock/transfer", icon: Send },
    ],
  },
  {
    header: "Manage Sale",
    name: "Sales",
    icon: ShoppingCart,
    subroutes: [
      { name: "Sales", href: "/sales", icon: Heart },
      { name: "Sale Return", href: "/sales/return", icon: RefreshCw },
      { name: "Quotation", href: "/sales/quotation", icon: FileText },
    ],
  },
  {
    header: "CRM",
    name: "CRM",
    icon: Users,
    subroutes: [
      { name: "Customers", href: "/reports?tab=crm", icon: Users },
      { name: "User List", href: "/crm/users", icon: UserPlus },
      { name: "Staff", href: "/crm/staff", icon: UserPlus },
    ],
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    header: "General Module",
    name: "General",
    icon: Building2,
    subroutes: [
      { name: "Locations", href: "/locations", icon: MapPin },
      { name: "Branch", href: "/branch", icon: MapPin },
    ],
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default navigation;
