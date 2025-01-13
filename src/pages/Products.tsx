import React, { useEffect, useState } from "react";
import { Table } from "@/components/ui/table";
import { axiosClient } from "@/axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const response = await axiosClient.get("/products");
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

  const getBranchPrice = (product: any) => {
    if (!product) return 0;
    
    if (product.allBranches) {
      return parseFloat(product.basePrice || 0);
    }
    
    if (selectedBranch && selectedBranch !== "all") {
      const branchPrice = product.branchPrices?.find(
        (bp: any) => bp.branchId === selectedBranch
      );
      return branchPrice ? parseFloat(branchPrice.price) : parseFloat(product.basePrice || 0);
    }
    
    return parseFloat(product.basePrice || 0);
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
      <h1 className="text-2xl font-bold">Products</h1>
      <Button onClick={() => setSelectedBranch(null)}>All Branches</Button>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <TableCell>
                ₦{getBranchPrice(product).toFixed(2)}
              </TableCell>
              <td>{product.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Products;
