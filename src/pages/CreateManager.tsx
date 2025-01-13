import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

const CreateManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const editingManager = location.state?.manager;
  const [managerType, setManagerType] = useState<"branch_manager" | "outlet_manager" | "">(
    editingManager?.managerType || ""
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    managerType: "",
    branchId: "",
    outletId: "",
    userType: "manager",
  });

  useEffect(() => {
    if (editingManager) {
      setFormData({
        name: editingManager.name,
        email: editingManager.email,
        phone: editingManager.phone,
        managerType: editingManager.managerType,
        branchId: editingManager.branchId || "",
        outletId: editingManager.outletId || "",
        userType: "manager",
      });
    }
  }, [editingManager]);

  const { data: branches } = useQuery({
    queryKey: ["unassigned-branches"],
    queryFn: async () => {
      const response = await axiosClient.get("/branches?hasManager=false");
      return editingManager?.branchId
        ? [...response.data, editingManager.branch]
        : response.data;
    },
    enabled: managerType === "branch_manager",
  });

  const { data: outlets } = useQuery({
    queryKey: ["unassigned-outlets"],
    queryFn: async () => {
      const response = await axiosClient.get("/outlets?hasManager=false");
      return editingManager?.outletId
        ? [...response.data, editingManager.outlet]
        : response.data;
    },
    enabled: managerType === "outlet_manager",
  });

  const mutation = useMutation({
    mutationFn: (data: typeof formData) =>
      editingManager
        ? axiosClient.put(`/managers/${editingManager.id}`, data)
        : axiosClient.post("/managers", data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Manager ${editingManager ? "updated" : "created"} successfully`,
      });
      navigate("/admin/crm/managers");
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${editingManager ? "update" : "create"} manager`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    setFormData((prev) => ({
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
          onClick={() => navigate("/admin/crm/managers")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {editingManager ? "Edit" : "Create New"} Manager
        </h1>
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
            <Label>Manager Type</Label>
            <Select
              value={managerType}
              onValueChange={(value: "branch_manager" | "outlet_manager") => {
                setManagerType(value);
                setFormData(prev => ({
                  ...prev,
                  managerType: value,
                  branchId: "",
                  outletId: "",
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select manager type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="branch_manager">Branch Manager</SelectItem>
                <SelectItem value="outlet_manager">Outlet Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {managerType === "branch_manager" && (
            <div className="space-y-2">
              <Label>Branch</Label>
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
          )}

          {managerType === "outlet_manager" && (
            <div className="space-y-2">
              <Label>Outlet</Label>
              <Select
                value={formData.outletId}
                onValueChange={(value) =>
                  handleChange({ target: { name: "outletId", value } })
                }
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
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/crm/managers")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending
              ? editingManager
                ? "Updating..."
                : "Creating..."
              : editingManager
              ? "Update Manager"
              : "Create Manager"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateManager;