import React, { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";

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
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const response = await axiosClient.get("/products");
      console.log("Fetched products:", response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load products. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getBranchPrice = (product: Product) => {
    if (!product) return 0;
    
    if (product.allBranches) {
      return product.basePrice || 0;
    }
    
    if (selectedBranch && selectedBranch !== "all") {
      const branchPrice = product.branchPrices?.find(
        (bp) => bp.branchId === selectedBranch
      );
      return branchPrice ? branchPrice.price : (product.basePrice || 0);
    }
    
    return product.basePrice || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setSelectedBranch(null)}>All Branches</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>₦{getBranchPrice(product).toFixed(2)}</TableCell>
                <TableCell>{product.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Products;