import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { logout } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-end p-4">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      <Outlet />
    </div>
  );
};

export default AdminLayout;