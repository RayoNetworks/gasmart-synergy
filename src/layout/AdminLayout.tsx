import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { logout } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LogOut, Menu } from "lucide-react";
import navigation from "@/common/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
    navigate("/login");
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-r border-primary/50">
          <SidebarHeader className="border-b border-primary/50 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">Admin Dashboard</h2>
              {isMobile && <SidebarTrigger />}
            </div>
          </SidebarHeader>
          <SidebarContent>
            {navigation.map((group, index) => (
              <SidebarGroup key={index}>
                {group.header && (
                  <SidebarGroupLabel>{group.header}</SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.subroutes ? (
                      group.subroutes.map((item) => (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActiveRoute(item.href)}
                          >
                            <Link to={item.href}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))
                    ) : (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActiveRoute(group.href!)}
                        >
                          <Link to={group.href!}>
                            <group.icon className="h-4 w-4" />
                            <span>{group.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>
        <div className="flex-1">
          <div className="flex items-center justify-between p-4 border-b border-primary/50">
            {isMobile && <SidebarTrigger><Menu className="h-6 w-6" /></SidebarTrigger>}
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="ml-auto flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
          <main className="p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;