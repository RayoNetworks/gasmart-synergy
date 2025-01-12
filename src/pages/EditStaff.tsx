import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import navigation from "@/common/navigation";
import cashierNavigation from "@/common/navigation/cashier";
import auditorNavigation from "@/common/navigation/auditor";
import { Role } from "@/lib/types";

type RoutePermission = {
  route: string;
  permissions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
};

const EditStaff = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<Role | "">("");
  const [routePermissions, setRoutePermissions] = useState<RoutePermission[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    branchId: "",
    userType: "staff",
    role: "",
    permissions: [],
  });

  const { data: staff } = useQuery({
    queryKey: ["staff", id],
    queryFn: async () => {
      const response = await axiosClient.get(`/users/${id}`);
      return response.data;
    },
  });

  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const response = await axiosClient.get("/branches");
      return response.data;
    },
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        branchId: staff.branchId,
        userType: "staff",
        role: staff.role,
        permissions: staff.permissions || [],
      });
      setSelectedRole(staff.role as Role);
      if (staff.permissions) {
        setRoutePermissions(staff.permissions);
      } else {
        const routes = getNavigationByRole(staff.role as Role).flatMap(item => 
          item.subroutes ? item.subroutes.map(sub => sub.href) : [item.href]
        );
        setRoutePermissions(routes.map(route => ({
          route,
          permissions: {
            create: false,
            read: false,
            update: false,
            delete: false,
          }
        })));
      }
    }
  }, [staff]);

  const getNavigationByRole = (role: Role) => {
    switch (role) {
      case "admin":
        return navigation;
      case "cashier":
        return cashierNavigation;
      case "auditor":
        return auditorNavigation;
      default:
        return [];
    }
  };

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    setFormData(prev => ({ ...prev, role }));
    const routes = getNavigationByRole(role).flatMap(item => 
      item.subroutes ? item.subroutes.map(sub => sub.href) : [item.href]
    );
    setRoutePermissions(routes.map(route => ({
      route,
      permissions: {
        create: false,
        read: false,
        update: false,
        delete: false,
      }
    })));
  };

  const handlePermissionToggle = (route: string, permission: keyof RoutePermission["permissions"]) => {
    setRoutePermissions(prev => prev.map(rp => 
      rp.route === route 
        ? { ...rp, permissions: { ...rp.permissions, [permission]: !rp.permissions[permission] }}
        : rp
    ));
  };

  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) => axiosClient.put(`/users/${id}`, {
      ...data,
      permissions: routePermissions,
    }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Staff member updated successfully",
      });
      navigate("/admin/crm/staff");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update staff member",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/crm/staff")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Staff Member</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branchId">Branch</Label>
            <Select
              value={formData.branchId}
              onValueChange={(value) =>
                handleChange({ target: { name: "branchId", value } })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branches?.map((branch: any) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="cashier">Cashier</SelectItem>
                <SelectItem value="auditor">Auditor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedRole && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Route Permissions</h2>
            <div className="space-y-4">
              {routePermissions.map((rp) => (
                <div key={rp.route} className="space-y-2 p-4 border rounded-lg">
                  <h3 className="font-medium">{rp.route}</h3>
                  <ToggleGroup type="multiple" className="justify-start">
                    <ToggleGroupItem
                      value="create"
                      aria-label="Toggle create"
                      onClick={() => handlePermissionToggle(rp.route, "create")}
                    >
                      Create
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="read"
                      aria-label="Toggle read"
                      onClick={() => handlePermissionToggle(rp.route, "read")}
                    >
                      Read
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="update"
                      aria-label="Toggle update"
                      onClick={() => handlePermissionToggle(rp.route, "update")}
                    >
                      Update
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="delete"
                      aria-label="Toggle delete"
                      onClick={() => handlePermissionToggle(rp.route, "delete")}
                    >
                      Delete
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/crm/staff")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Updating..." : "Update Staff"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditStaff;