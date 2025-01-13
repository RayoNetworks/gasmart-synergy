import { useParams, useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const BranchOutlets = () => {
  const { id: branchId } = useParams();
  const navigate = useNavigate();

  const { data: branch } = useQuery({
    queryKey: ["branch", branchId],
    queryFn: async () => {
      const response = await axiosClient.get(`/branches/${branchId}`);
      return response.data;
    },
  });

  const { data: outlets } = useQuery({
    queryKey: ["branch-outlets", branchId],
    queryFn: async () => {
      const response = await axiosClient.get("/outlets");
      return response.data.filter((outlet: any) => outlet.branchId === branchId);
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Branch Outlets</h1>
          <p className="text-gray-500">{branch?.name}</p>
        </div>
        <Button 
          onClick={() => 
            navigate(`/admin/outlets/create?branchId=${branchId}`)
          }
        >
          <Plus className="mr-2 h-4 w-4" /> Add Outlet
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {outlets?.map((outlet: any) => (
            <TableRow key={outlet.id}>
              <TableCell>{outlet.name}</TableCell>
              <TableCell>{outlet.location}</TableCell>
              <TableCell>{outlet.manager}</TableCell>
              <TableCell>{outlet.phone}</TableCell>
              <TableCell>{outlet.email}</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BranchOutlets;