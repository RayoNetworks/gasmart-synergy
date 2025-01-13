import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Eye, Edit, Trash, RotateCcw } from "lucide-react";
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
  const [searchParams] = useSearchParams();
  const initialOutletName = searchParams.get('outletName') || '';

  const [outletNameFilter, setOutletNameFilter] = useState(initialOutletName);
  const [branchNameFilter, setBranchNameFilter] = useState("");
  const [managerFilter, setManagerFilter] = useState("");

  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const response = await axiosClient.get("/branches");
      return response.data;
    },
  });

  const { data: outlets, isLoading } = useQuery({
    queryKey: ["outlets", outletNameFilter, branchNameFilter, managerFilter],
    queryFn: async () => {
      const response = await axiosClient.get("/outlets");
      let filteredOutlets = response.data;

      if (outletNameFilter) {
        filteredOutlets = filteredOutlets.filter((outlet: Outlet) =>
          outlet.name.toLowerCase().includes(outletNameFilter.toLowerCase())
        );
      }

      if (branchNameFilter) {
        filteredOutlets = filteredOutlets.filter((outlet: Outlet) =>
          outlet.branch.name.toLowerCase().includes(branchNameFilter.toLowerCase())
        );
      }

      if (managerFilter) {
        filteredOutlets = filteredOutlets.filter((outlet: Outlet) =>
          outlet.manager.toLowerCase().includes(managerFilter.toLowerCase())
        );
      }

      return filteredOutlets;
    },
  });

  const handleViewBranch = (branchId: string) => {
    navigate(`/admin/branch/${branchId}`);
  };

  const handleReset = () => {
    setOutletNameFilter("");
    setBranchNameFilter("");
    setManagerFilter("");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Outlets</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset Filters
          </Button>
          <Button onClick={() => navigate("/admin/outlets/create")}>
            <Plus className="mr-2 h-4 w-4" /> Add Outlet
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <Input
          placeholder="Filter by outlet name"
          value={outletNameFilter}
          onChange={(e) => setOutletNameFilter(e.target.value)}
          className="w-[250px]"
        />
        <Input
          placeholder="Filter by branch name"
          value={branchNameFilter}
          onChange={(e) => setBranchNameFilter(e.target.value)}
          className="w-[250px]"
        />
        <Input
          placeholder="Filter by manager name"
          value={managerFilter}
          onChange={(e) => setManagerFilter(e.target.value)}
          className="w-[250px]"
        />
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