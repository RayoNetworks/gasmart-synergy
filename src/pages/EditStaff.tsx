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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import navigation from "@/common/navigation";
import cashierNavigation from "@/common/navigation/cashier";
import auditorNavigation from "@/common/navigation/auditor";
import { Role } from "@/lib/types";

type RoutePermission = {
  route: {
    name: string;
    href: string;
  };
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
  const [selectedBranchId, setSelectedBranchId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    branchId: "",
    outletId: "",
    userType: "staff",
    role: "",
    permissions: [],
  });

  const { data: staff, isLoading: isLoadingStaff } = useQuery({
    queryKey: ["staff", id],
    queryFn: async () => {
      const response = await axiosClient.get(`/users/${id}`);
      console.log("Fetched staff data:", response.data);
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

  const { data: outlets } = useQuery({
    queryKey: ["outlets", formData.branchId],
    queryFn: async () => {
      if (!formData.branchId) return [];
      const response = await axiosClient.get("/outlets", {
        params: { branchId: formData.branchId }
      });
      return response.data;
    },
    enabled: !!formData.branchId,
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        branchId: staff.branchId,
        outletId: staff.outletId,
        userType: "staff",
        role: staff.role,
        permissions: staff.permissions || [],
      });
      setSelectedRole(staff.role as Role);
      setSelectedBranchId(staff.branchId);
      if (staff.permissions) {
        setRoutePermissions(staff.permissions);
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
    const routes = getNavigationByRole(role).flatMap((item) =>
      item.subroutes
        ? item.subroutes.map((sub) => ({
            name: sub.name,
            href: sub?.href,
          }))
        : [
            {
              name: item?.name,
              href: item?.href,
            },
          ]
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
      rp.route?.name === route 
        ? { ...rp, permissions: { ...rp.permissions, [permission]: !rp.permissions[permission] }}
        : rp
    ));
  };

  const handleBranchChange = (branchId: string) => {
    setSelectedBranchId(branchId);
    setFormData(prev => ({
      ...prev,
      branchId,
      outletId: "", // Reset outlet when branch changes
    }));
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

  if (isLoadingStaff) {
    return <div>Loading...</div>;
  }

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Staff Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Information</CardTitle>
            <CardDescription>View and edit staff details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Current Role</Label>
                <Badge className="ml-2" variant={staff?.role === "admin" ? "default" : "secondary"}>
                  {staff?.role}
                </Badge>
              </div>
              <div>
                <Label>Current Branch</Label>
                <p className="text-sm text-gray-500">{staff?.branch?.name}</p>
              </div>
              <div>
                <Label>Current Outlet</Label>
                <p className="text-sm text-gray-500">{staff?.outlet?.name}</p>
              </div>
              <Separator />
              <div>
                <Label>Status</Label>
                <Badge variant={staff?.status === "active" ? "success" : "destructive"}>
                  {staff?.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit Details</CardTitle>
              <CardDescription>Update staff information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="branchId">Branch</Label>
                <Select
                  value={formData.branchId}
                  onValueChange={handleBranchChange}
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
                <Label htmlFor="outletId">Outlet</Label>
                <Select
                  value={formData.outletId}
                  onValueChange={(value) =>
                    handleChange({ target: { name: "outletId", value } })
                  }
                  disabled={!formData.branchId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select outlet" />
                  </SelectTrigger>
                  <SelectContent>
                    {outlets?.map((outlet: any) => (
                      <SelectItem key={outlet.id} value={outlet.id}>
                        {outlet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Permissions Card */}
          {selectedRole && (
            <Card>
              <CardHeader>
                <CardTitle>Route Permissions</CardTitle>
                <CardDescription>Manage staff access permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {routePermissions.map((rp) => (
                    <div key={rp.route?.name} className="space-y-2 p-4 border rounded-lg">
                      <h3 className="font-medium">{rp.route?.name}</h3>
                      <ToggleGroup type="multiple" className="justify-start">
                        <ToggleGroupItem
                          value="create"
                          aria-label="Toggle create"
                          data-state={rp.permissions.create ? "on" : "off"}
                          onClick={() => handlePermissionToggle(rp.route?.name, "create")}
                        >
                          Create
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="read"
                          aria-label="Toggle read"
                          data-state={rp.permissions.read ? "on" : "off"}
                          onClick={() => handlePermissionToggle(rp.route?.name, "read")}
                        >
                          Read
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="update"
                          aria-label="Toggle update"
                          data-state={rp.permissions.update ? "on" : "off"}
                          onClick={() => handlePermissionToggle(rp.route?.name, "update")}
                        >
                          Update
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="delete"
                          aria-label="Toggle delete"
                          data-state={rp.permissions.delete ? "on" : "off"}
                          onClick={() => handlePermissionToggle(rp.route?.name, "delete")}
                        >
                          Delete
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
    </div>
  );
};

export default EditStaff;