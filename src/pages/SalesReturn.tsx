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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Box, Building2, MoreHorizontal } from "lucide-react";

interface SaleReturn {
  id: string;
  productName: string;
  quantity: number;
  returnDate: string;
  reason: string;
  branchId: string;
  branch: {
    id: string;
    name: string;
    address: string;
  };
}

const SalesReturn = () => {
  const navigate = useNavigate();
  const [selectedReturn, setSelectedReturn] = useState<SaleReturn | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { data: returns, isLoading } = useQuery({
    queryKey: ["sales-returns"],
    queryFn: async () => {
      const response = await axiosClient.get("/sales-returns");
      return response.data;
    },
  });

  const handleViewBranch = (branchId: string) => {
    localStorage.setItem("viewBranchId", branchId);
    navigate(`/admin/branch`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Sales Returns</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Return Date</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {returns?.map((saleReturn: SaleReturn) => (
            <TableRow key={saleReturn.id}>
              <TableCell>{saleReturn.productName}</TableCell>
              <TableCell>{saleReturn.quantity}</TableCell>
              <TableCell>{saleReturn.returnDate}</TableCell>
              <TableCell>{saleReturn.reason}</TableCell>
              <TableCell>{saleReturn.branch.name}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedReturn(saleReturn);
                        setShowDetailsModal(true);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate(`/admin/products/${saleReturn.id}`)}
                    >
                      <Box className="mr-2 h-4 w-4" />
                      View Product
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleViewBranch(saleReturn.branchId)}
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      View Branch
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Details</DialogTitle>
          </DialogHeader>
          {selectedReturn && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Product Name</h4>
                <p>{selectedReturn.productName}</p>
              </div>
              <div>
                <h4 className="font-medium">Quantity Returned</h4>
                <p>{selectedReturn.quantity}</p>
              </div>
              <div>
                <h4 className="font-medium">Return Date</h4>
                <p>{selectedReturn.returnDate}</p>
              </div>
              <div>
                <h4 className="font-medium">Reason for Return</h4>
                <p>{selectedReturn.reason}</p>
              </div>
              <div>
                <h4 className="font-medium">Branch Information</h4>
                <p>{selectedReturn.branch.name}</p>
                <p>{selectedReturn.branch.address}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesReturn;