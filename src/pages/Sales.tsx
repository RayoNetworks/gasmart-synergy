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
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Eye, User, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sales = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: sales } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const response = await axiosClient.get("/sales");
      console.log("Fetched sales data:", response.data);
      return response.data;
    },
  });

  const handleViewBranch = (branchId: string) => {
    navigate(`/admin/branch`);
    localStorage.setItem('viewBranchId', branchId);
  };

  const handleViewUser = (userId: string) => {
    navigate(`/admin/crm/users`);
    localStorage.setItem('viewUserId', userId);
  };

  const handleViewOutlet = (outletId: string) => {
    navigate(`/admin/outlets`);
    localStorage.setItem('viewOutletId', outletId);
    console.log("Navigating to outlet:", outletId);
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
              <TableHead>Outlet</TableHead>
              <TableHead>Cashier</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales?.map((sale: any) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.product}</TableCell>
                <TableCell>{sale.branch.name}</TableCell>
                <TableCell>{sale.outlet?.name || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{sale.user.name}</span>
                    <span className="text-sm text-gray-500">{sale.user.email}</span>
                  </div>
                </TableCell>
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
                      <DropdownMenuItem onClick={() => handleViewUser(sale.user.id)}>
                        <User className="mr-2 h-4 w-4" />
                        View Cashier
                      </DropdownMenuItem>
                      {sale.outlet && (
                        <DropdownMenuItem onClick={() => handleViewOutlet(sale.outlet.id)}>
                          <Store className="mr-2 h-4 w-4" />
                          View Outlet
                        </DropdownMenuItem>
                      )}
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