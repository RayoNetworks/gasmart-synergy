import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { axiosClient } from "@/axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Eye, 
  Edit, 
  Trash, 
  MoreHorizontal, 
  Building, 
  Store, 
  Plus,
  Layers,
  Package
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  price: number;
  status: string;
  allBranches: boolean;
  branchPrices: Array<{
    branchId: string;
    price: number;
  }>;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  branch?: {
    id: string;
    name: string;
  };
  outlet?: {
    id: string;
    name: string;
  };
}

const Products = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axiosClient.get("/products");
      console.log("Fetched products:", response.data);
      return response.data;
    },
  });

  const handleDelete = async (productId: string) => {
    try {
      await axiosClient.delete(`/products/${productId}`);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      refetch();
      setIsDeleteAlertOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product",
      });
    }
  };

  const handleViewBranch = (branchId: string) => {
    localStorage.setItem('viewBranchId', branchId);
    navigate(`/admin/branch`);
  };

  const handleViewOutlet = (outletId: string) => {
    localStorage.setItem('viewOutletId', outletId);
    navigate(`/admin/outlets`);
  };

  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Package className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => navigate("/admin/products/create")}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Outlet</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product: Product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>{product.branch?.name || 'All Branches'}</TableCell>
                <TableCell>{product.outlet?.name || 'All Outlets'}</TableCell>
                <TableCell>₦{product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.status === "In Stock" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {product.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedProduct(product);
                        setIsViewModalOpen(true);
                      }}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/admin/products/edit/${product.id}`)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedProduct(product);
                        setIsDeleteAlertOpen(true);
                      }} className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/admin/products/variation/${product.id}/create`)}>
                        <Layers className="mr-2 h-4 w-4" /> Create Variation
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/admin/reports?tab=stock&productId=${product.id}`)}>
                        <Package className="mr-2 h-4 w-4" /> Check Stock
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Product Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Detailed information about the product
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Name</h4>
              <p className="text-sm text-gray-500">{selectedProduct?.name}</p>
            </div>
            <div>
              <h4 className="font-medium">Category</h4>
              <p className="text-sm text-gray-500">{selectedProduct?.category?.name}</p>
            </div>
            <div>
              <h4 className="font-medium">Description</h4>
              <p className="text-sm text-gray-500">{selectedProduct?.description}</p>
            </div>
            <div>
              <h4 className="font-medium">Price</h4>
              <p className="text-sm text-gray-500">₦{selectedProduct?.price.toFixed(2)}</p>
            </div>
            <div>
              <h4 className="font-medium">Status</h4>
              <p className="text-sm text-gray-500">{selectedProduct?.status}</p>
            </div>
            {selectedProduct?.branch && (
              <div>
                <h4 className="font-medium">Branch</h4>
                <p className="text-sm text-gray-500">{selectedProduct.branch.name}</p>
              </div>
            )}
            {selectedProduct?.outlet && (
              <div>
                <h4 className="font-medium">Outlet</h4>
                <p className="text-sm text-gray-500">{selectedProduct.outlet.name}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedProduct && handleDelete(selectedProduct.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;
