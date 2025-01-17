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
  Beaker,
  Droplet,
  Truck,
  Map,
  Bell,
  Route,
  Printer,
  Cloud,
  Download,
  ClipboardCheck,
  Shield,
  UserCheck,
  UserCog,
  Percent,
  Scale,
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
        icon: Package,
      },
      {
        name: "Product Discount Management",
        href: "/admin/products/discount",
        icon: Percent,
      },
      {
        name: "Product Kgs to Liters Conversion",
        href: "/admin/products/product-conversion",
        icon: Scale,
      },
      {
        name: "Lubricants & Oils",
        href: "/admin/products/lubricants",
        icon: Beaker,
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
    header: "Inventary Management",
    name: "Stock",
    icon: Database,
    subroutes: [
      {
        name: "Manage Stock",
        href: "/admin/stock/manage",
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
    header: "Sales and Audit",
    name: "Sales",
    icon: ShoppingCart,
    subroutes: [
      { name: "Sales", href: "/admin/sales", icon: ShoppingCart },
      { name: "Sales Return", href: "/admin/sales/return", icon: RefreshCw },
      { name: "Sales Quotation", href: "/admin/sales/quotation", icon: FileText },
      { name: "Audit", href: "/admin/audit-sales", icon: ClipboardCheck },
    ],
  },
  {
    header: "CRM",
    name: "CRM",
    icon: Users,
    subroutes: [
      { name: "Customers", href: "/admin/crm/customers", icon: Users },
      { name: "Customer Loyalty", href: "/admin/crm/loyalty", icon: Heart },
    ],
  },
  {
    header: "User Roles and Permission",
    name: "roles",
    icon: Shield,
    subroutes: [
      { name: "User List", href: "/admin/crm/users", icon: Users },
      { name: "Staff", href: "/admin/crm/staff", icon: UserCheck },
      { name: "Managers", href: "/admin/crm/managers", icon: UserCog }
    ],
  },
  {
    header: "Integration",
    name: "integrate",
    icon: Cloud,
    subroutes: [
      { name: "Hardware", href: "/admin/integrate/hardware", icon: Printer },
      { name: "Software", href: "/admin/integrate/software", icon: Cloud },
    ],
  },
  {
    header: "Fleet Management",
    name: "Fleet",
    icon: Truck,
    subroutes: [
      { name: "Tracking", href: "/admin/fleet/tracking", icon: Map },
      { name: "Geofencing", href: "/admin/fleet/geofencing", icon: MapPin },
      { name: "Notifications", href: "/admin/fleet/notifications", icon: Bell },
      { name: "Route Planning", href: "/admin/fleet/routes", icon: Route },
    ],
  },
  {
    header: 'Analytics',
    name: "Analytics",
    icon: BarChart3,
    subroutes: [
      {
        name: 'Reports',
        href: "/admin/reports",
        icon: BarChart3,
      },
      {
        name: 'Download Reports',
        href: "/admin/download-reports",
        icon: Download,
      }
    ]
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
];

export default navigation;