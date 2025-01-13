import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosClient } from "@/axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Managers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [managerType, setManagerType] = useState<string>("");

  const { data: managers, refetch } = useQuery({
    queryKey: ["managers", managerType],
    queryFn: async () => {
      const response = await axiosClient.get("/managers", {
        params: { managerType: managerType || undefined },
      });
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (managerId: string) =>
      axiosClient.delete(`/managers/${managerId}`),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Manager deleted successfully",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete manager",
        variant: "destructive",
      });
    },
  });

  const handleView = (manager: any) => {
    if (manager.managerType === "branch_manager") {
      navigate(`/admin/branches/${manager.branchId}`);
    } else {
      navigate(`/admin/outlets/${manager.outletId}`);
    }
  };

  const handleEdit = (manager: any) => {
    navigate(`/admin/crm/managers/create`, { state: { manager } });
  };

  const handleDelete = (managerId: string) => {
    deleteMutation.mutate(managerId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Managers</h1>
        <Button onClick={() => navigate("/admin/crm/managers/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Manager
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="w-[200px]">
          <Select
            value={managerType}
            onValueChange={(value) => setManagerType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Managers</SelectItem>
              <SelectItem value="branch_manager">Branch Managers</SelectItem>
              <SelectItem value="outlet_manager">Outlet Managers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Managing</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {managers?.map((manager: any) => (
            <TableRow key={manager.id}>
              <TableCell>{manager.name}</TableCell>
              <TableCell>{manager.email}</TableCell>
              <TableCell>{manager.phone}</TableCell>
              <TableCell>
                {manager.managerType === "branch_manager"
                  ? "Branch Manager"
                  : "Outlet Manager"}
              </TableCell>
              <TableCell>
                {manager.managerType === "branch_manager"
                  ? manager.branch?.name
                  : manager.outlet?.name}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(manager)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View {manager.managerType === "branch_manager" ? "Branch" : "Outlet"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(manager)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(manager.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Managers;