import { ShoppingCart, Package, Database, FileText } from "lucide-react";

const cashierNavigation = [
  {
    name: "Sales",
    icon: ShoppingCart,
    subroutes: [
      { name: "Sales", href: "/cashier/sales", icon: ShoppingCart },
      { name: "Sale Return", href: "/cashier/sales/return", icon: FileText },
      { name: "Quotation", href: "/cashier/sales/quotation", icon: FileText },
    ],
  },
  {
    name: "Products",
    icon: Package,
    subroutes: [
      { name: "Products List", href: "/cashier/products", icon: Package },
    ],
  },
  {
    name: "Stock",
    icon: Database,
    subroutes: [
      { name: "Stock Transfer", href: "/cashier/stock/transfer", icon: Database },
    ],
  },
];

export default cashierNavigation;