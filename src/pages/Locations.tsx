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
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  status: string;
}

const Locations = () => {
  const navigate = useNavigate();
  console.log("Rendering Locations page");

  const { data: locations, isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await axiosClient.get("/branches");
      console.log("Fetched locations:", response.data);
      return response.data;
    },
  });

  const handleViewBranch = (branchId: string) => {
    console.log("Viewing branch:", branchId);
    // Navigate to branch page and trigger modal open via URL param
    navigate(`/admin/branch?view=${branchId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Branch Locations</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Branch Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations?.map((location: Location) => (
            <TableRow key={location.id}>
              <TableCell>{location.name}</TableCell>
              <TableCell>{location.address}</TableCell>
              <TableCell>{location.manager}</TableCell>
              <TableCell>
                <div>
                  <p>{location.phone}</p>
                  <p className="text-sm text-gray-500">{location.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    location.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {location.status}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleViewBranch(location.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Locations;