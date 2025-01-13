import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import { Plus } from "lucide-react";

const Managers = () => {
  const navigate = useNavigate();

  const { data: managers } = useQuery({
    queryKey: ["managers"],
    queryFn: async () => {
      const response = await axiosClient.get("/users?userType=manager");
      return response.data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Managers</h1>
        <Button onClick={() => navigate("/admin/crm/managers/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Manager
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {managers?.map((manager: any) => (
            <TableRow key={manager.id}>
              <TableCell>{manager.name}</TableCell>
              <TableCell>{manager.email}</TableCell>
              <TableCell>{manager.phone}</TableCell>
              <TableCell>{manager.managerType}</TableCell>
              <TableCell>
                {manager.managerType === "branch_manager"
                  ? manager.branch?.name
                  : manager.outlet?.name}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Managers;