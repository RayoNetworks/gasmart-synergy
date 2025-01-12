import { BarChart3, Package, Database, FileText } from "lucide-react";

const auditorNavigation = [
  {
    name: "Reports",
    icon: BarChart3,
    subroutes: [
      { name: "Sales Report", href: "/auditor/reports/sales", icon: BarChart3 },
      { name: "Stock Report", href: "/auditor/reports/stock", icon: Database },
    ],
  },
  {
    name: "Products",
    icon: Package,
    subroutes: [
      { name: "Products List", href: "/auditor/products", icon: Package },
    ],
  },
  {
    name: "Documents",
    icon: FileText,
    subroutes: [
      { name: "Quotations", href: "/auditor/documents/quotations", icon: FileText },
      { name: "Invoices", href: "/auditor/documents/invoices", icon: FileText },
    ],
  },
];

export default auditorNavigation;