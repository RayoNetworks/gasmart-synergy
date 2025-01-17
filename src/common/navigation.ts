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
      { name: "Sales", href: "/admin/sales", icon: Heart },
      { name: "Audit", href: "/admin/audit-sales", icon: Heart },//create audit page i.e that is the page to audit sales. all functionalies for auditing sales should be included, icon should be related also//

      //not part of command
      // { name: "Sale Return", href: "/admin/sales/return", icon: RefreshCw },
      // { name: "Quotation", href: "/admin/sales/quotation", icon: FileText },
    ],
  },
  {
    header: "CRM",
    name: "CRM",
    icon: Users,
    subroutes: [
      { name: "Customers", href: "/admin/crm/customers", icon: Users },

    ],
  },
  {
    header: "User Roles and Permission",
    name: "roles",
    icon: Users,
    subroutes: [
      { name: "User List", href: "/admin/crm/users", icon: UserPlus },
      { name: "Staff", href: "/admin/crm/staff", icon: UserPlus },
      { name: "Managers", href: "/admin/crm/managers", icon: UserPlus }
    ],
  },


  {
    header: 'Analytics',
    name: "Analytics",
    icon: BarChart3,//change icon to something very suitable
    subroutes: [
      {
        name: 'Reports',
        href: "/admin/reports",
        icon: BarChart3,
      },
      {
        name: 'Download Reports',
        href: "/admin/download-reports",//create pages to have a list of differents download reports corresponding to the report type
        icon: BarChart3,//change icon to something very suitable
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
  // {
  //   header: "Fleet Management",
  //   name: "Fleet",
  //   icon: Truck,
  //   subroutes: [
  //     {
  //       name: "Vehicle Tracking",
  //       href: "/admin/fleet/tracking",
  //       icon: Map,
  //     },
  //     {
  //       name: "Geo-Fencing",
  //       href: "/admin/fleet/geofencing",
  //       icon: MapPin,
  //     },
  //     {
  //       name: "Notifications",
  //       href: "/admin/fleet/notifications",
  //       icon: Bell,
  //     },
  //     {
  //       name: "Route Planning",
  //       href: "/admin/fleet/routes",
  //       icon: Route,
  //     },
  //   ],
  // },
  // {
  //   name: "Settings",
  //   href: "/admin/settings",
  //   icon: Settings,
  // },
];

export default navigation;
