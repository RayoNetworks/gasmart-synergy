import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Eye, MoreHorizontal, PlusCircle, Trash } from "lucide-react";
import { toast } from "sonner";

const ProductVariation = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedVariation, setSelectedVariation] = useState<any>(null);

  const { data: products, refetch } = useQuery({
    queryKey: ['products-with-variations'],
    queryFn: async () => {
      const response = await axiosClient.get('/products');
      // Filter products that have variations
      return response.data.filter((product: any) => 
        product.variations && product.variations.length > 0
      );
    }
  });

  const handleDeleteVariation = async () => {
    if (selectedProduct && selectedVariation) {
      try {
        await axiosClient.delete(`/products/${selectedProduct.id}/variations/${selectedVariation.id}`);
        toast.success("Variation deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete variation");
      }
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
      setSelectedVariation(null);
    }
  };

  const filteredProducts = products?.filter((product: any) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Variations</h1>
      </div>

      <div className="flex space-x-4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Number of Variations</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts?.map((product: any) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>{product.variations?.length || 0}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedProduct(product);
                        setViewDialogOpen(true);
                      }}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Product
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedProduct(product);
                        setViewDialogOpen(true);
                      }}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Variations
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => 
                        navigate(`/admin/products/variation/${product.id}/create`)
                      }>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add More Variation
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setSelectedProduct(product);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Variation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Name</h4>
                <p>{selectedProduct.name}</p>
              </div>
              <div>
                <h4 className="font-semibold">Category</h4>
                <p>{selectedProduct.category?.name}</p>
              </div>
              <div>
                <h4 className="font-semibold">Variations</h4>
                <div className="space-y-2">
                  {selectedProduct.variations?.map((variation: any) => (
                    <div key={variation.id} className="border p-2 rounded">
                      <p><span className="font-semibold">Type:</span> {variation.type}</p>
                      <p><span className="font-semibold">Name:</span> {variation.name}</p>
                      <p><span className="font-semibold">Price:</span> ₦{variation.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the variation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVariation}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductVariation;