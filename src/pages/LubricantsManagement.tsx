import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Lubricant {
  id: string;
  name: string;
  type: string;
  viscosity: string;
  price: number;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const LubricantsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: lubricants, isLoading } = useQuery({
    queryKey: ["lubricants"],
    queryFn: async () => {
      console.log("Fetching lubricants data");
      const response = await axiosClient.get("/lubricants");
      return response.data;
    },
  });

  const handleAddLubricant = () => {
    toast.info("Add lubricant functionality coming soon");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredLubricants = lubricants?.filter((lubricant: Lubricant) =>
    lubricant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Lubricants & Oils Management</h1>
        <Button onClick={handleAddLubricant}>
          <Plus className="mr-2 h-4 w-4" /> Add Lubricant
        </Button>
      </div>

      <div className="flex space-x-4">
        <Input
          placeholder="Search lubricants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Viscosity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLubricants?.map((lubricant: Lubricant) => (
              <TableRow key={lubricant.id}>
                <TableCell className="font-medium">{lubricant.name}</TableCell>
                <TableCell>{lubricant.type}</TableCell>
                <TableCell>{lubricant.viscosity}</TableCell>
                <TableCell>₦{lubricant.price.toFixed(2)}</TableCell>
                <TableCell>{lubricant.stock}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      lubricant.status === "Out of Stock"
                        ? "destructive"
                        : lubricant.status === "Low Stock"
                        ? "secondary"
                        : "default"
                    }
                  >
                    {lubricant.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
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
    </div>
  );
};

export default LubricantsManagement;