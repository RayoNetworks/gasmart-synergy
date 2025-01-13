import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sales = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock sales data with branch information
  const sales = [
    {
      id: 1,
      product: "LPG Cylinder 13kg",
      quantity: 2,
      amount: 120.00,
      date: "2024-03-20",
      status: "Completed",
      branch: {
        id: "1",
        name: "Main Branch",
      }
    },
    {
      id: 2,
      product: "Diesel",
      quantity: 50,
      amount: 275.50,
      date: "2024-03-20",
      status: "Completed",
      branch: {
        id: "2",
        name: "Port Harcourt Branch",
      }
    },
    {
      id: 3,
      product: "Petrol",
      quantity: 30,
      amount: 180.00,
      date: "2024-03-19",
      status: "Completed",
      branch: {
        id: "3",
        name: "Abuja Branch",
      }
    }
  ];

  const handleViewBranch = (branchId: string) => {
    navigate(`/admin/branch`);
    // The branch page will need to handle showing the view modal for the specific branch
    localStorage.setItem('viewBranchId', branchId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sales</h1>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search sales..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.product}</TableCell>
                <TableCell>{sale.branch.name}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>₦{sale.amount.toFixed(2)}</TableCell>
                <TableCell>{sale.date}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    {sale.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewBranch(sale.branch.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Branch
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

export default Sales;