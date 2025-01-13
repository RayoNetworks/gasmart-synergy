import { ShoppingCart, Package, Database, FileText, Fuel } from "lucide-react";

const cashierNavigation = [
  {
    name: "Point of Sale",
    icon: ShoppingCart,
    href: "/cashier",
  },
  {
    name: "Sales History",
    icon: FileText,
    href: "/cashier/sales",
  },
  {
    name: "Sales Return",
    icon: FileText,
    href: "/cashier/sales/return",
  },
  {
    name: "Fuel Products",
    icon: Fuel,
    href: "/cashier/products",
  },
  {
    name: "Stock",
    icon: Database,
    href: "/cashier/stock/transfer",
  },
];

export default cashierNavigation;