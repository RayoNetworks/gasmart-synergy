import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/axios";
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
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Eye, Edit, Trash, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Managers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [managerType, setManagerType] = useState<string>("");

  const handleView = (manager: any) => {
    if (manager.managerType === "branch_manager") {
      localStorage.setItem("viewBranchId", manager.branchId);
      navigate("/admin/branch");
    } else {
      localStorage.setItem("viewOutletId", manager.outletId);
      navigate("/admin/outlets");
    }
  };

  const handleReset = () => {
    setManagerType("");
  };

  const { data: managers = [], isLoading, error } = useQuery({
    queryKey: ["managers", managerType],
    queryFn: async () => {
      console.log('Fetching managers with type:', managerType);
      const response = await axiosClient.get("/managers", {
        params: { managerType: managerType || undefined },
      });
      console.log('Received managers data:', response.data);
      return response.data || [];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading managers</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Managers</h1>
        <Button onClick={() => navigate("/admin/crm/managers/create")}>
          <Plus className="mr-2 h-4 w-4" /> Add Manager
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <Select value={managerType} onValueChange={setManagerType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Managers</SelectItem>
            <SelectItem value="branch_manager">Branch Managers</SelectItem>
            <SelectItem value="outlet_manager">Outlet Managers</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Filters
        </Button>
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
          {Array.isArray(managers) && managers.map((manager: any) => (
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
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(manager)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View{" "}
                      {manager.managerType === "branch_manager"
                        ? "Branch"
                        : "Outlet"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        navigate("/admin/crm/managers/create", { 
                          state: { manager } 
                        })
                      }
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
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