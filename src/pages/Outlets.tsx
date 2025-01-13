import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/axios";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Outlet {
  id: string;
  name: string;
  location: string;
  branchId: string;
  branch: {
    id: string;
    name: string;
  };
  manager: string;
  phone: string;
  email: string;
  status: string;
}

const Outlets = () => {
  const navigate = useNavigate();

  const { data: outlets, isLoading } = useQuery({
    queryKey: ["outlets"],
    queryFn: async () => {
      const response = await axiosClient.get("/outlets");
      console.log("Fetched outlets:", response.data);
      return response.data;
    },
  });

  const handleViewBranch = (branchId: string) => {
    localStorage.setItem('viewBranchId', branchId);
    navigate('/admin/branch');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Outlets</h1>
        <Button onClick={() => navigate("/admin/outlets/create")}>
          <Plus className="mr-2 h-4 w-4" /> Add Outlet
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Branch</TableHead>
            <TableHead>Outlet Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {outlets?.map((outlet: Outlet) => (
            <TableRow key={outlet.id}>
              <TableCell>{outlet.branch.name}</TableCell>
              <TableCell>{outlet.name}</TableCell>
              <TableCell>{outlet.location}</TableCell>
              <TableCell>{outlet.manager}</TableCell>
              <TableCell>
                <div>
                  <p>{outlet.phone}</p>
                  <p className="text-sm text-gray-500">{outlet.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    outlet.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {outlet.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewBranch(outlet.branchId)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Branch
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/admin/outlets/${outlet.id}/edit`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Outlet
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

export default Outlets;