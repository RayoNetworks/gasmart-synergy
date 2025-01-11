import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  Menu,
} from "lucide-react";
import { Button } from "./ui/button";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Sales", href: "/sales", icon: ShoppingCart },
    { name: "Products", href: "/products", icon: Package },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

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
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
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