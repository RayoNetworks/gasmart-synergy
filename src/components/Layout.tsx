import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Database,
  Users,
  BarChart3,
  Settings,
  Menu,
  ChevronDown,
  Building2,
  UserPlus,
  ClipboardList,
  ArrowUpDown,
  Send,
  Heart,
  RefreshCw,
  FileText,
  MapPin,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // Define the navigation structure with parent routes and subroutes
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
        { name: "Product Variation", href: "/products/variation", icon: ArrowUpDown },
      ],
    },
    {
      header: "Manage Stock",
      name: "Stock",
      icon: Database,
      subroutes: [
        { name: "Manage Stock", href: "/reports?tab=stock", icon: Database },
        { name: "Stock Adjustment", href: "/stock/adjustment", icon: RefreshCw },
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
      ],
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  // Track which sections are expanded
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionName)
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 transform bg-white transition-transform duration-200 ease-in-out",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col border-r">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-primary">LPG POS</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              
              if (item.subroutes) {
                const isExpanded = expandedSections.includes(item.name);
                return (
                  <div key={item.name} className="space-y-1">
                    {item.header && (
                      <div className="px-2 py-2 text-xs font-semibold text-gray-400">
                        {item.header}
                      </div>
                    )}
                    <Collapsible
                      open={isExpanded}
                      onOpenChange={() => toggleSection(item.name)}
                    >
                      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                        <div className="flex items-center">
                          <Icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isExpanded ? "rotate-180" : ""
                          )}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1">
                        {item.subroutes.map((subroute) => {
                          const SubIcon = subroute.icon;
                          return (
                            <Link
                              key={subroute.href}
                              to={subroute.href}
                              className={cn(
                                "flex items-center rounded-md px-2 py-2 text-sm font-medium ml-6",
                                location.pathname === subroute.href
                                  ? "bg-primary text-white"
                                  : "text-gray-600 hover:bg-gray-50"
                              )}
                            >
                              <SubIcon className="mr-3 h-4 w-4" />
                              {subroute.name}
                            </Link>
                          );
                        })}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center rounded-md px-2 py-2 text-sm font-medium",
                    location.pathname === item.href
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "transition-margin duration-200 ease-in-out",
          isSidebarOpen ? "ml-64" : "ml-0"
        )}
      >
        <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;