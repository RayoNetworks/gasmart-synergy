import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
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
import { useState } from "react";

const ProductDiscount = () => {
  const { toast } = useToast();
  const [minQuantity, setMinQuantity] = useState<number>(0);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      console.log("Fetching products for discount management");
      const response = await axiosClient.get("/products");
      return response.data;
    },
  });

  const handleApplyDiscount = (productId: string) => {
    console.log("Applying discount:", {
      productId,
      minQuantity,
      discountPercentage,
    });
    toast({
      title: "Discount Applied",
      description: `Discount of ${discountPercentage}% applied for quantities over ${minQuantity}`,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Product Discount Management</h1>
      
      <div className="flex gap-4 items-end mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Minimum Quantity</label>
          <Input
            type="number"
            min="0"
            value={minQuantity}
            onChange={(e) => setMinQuantity(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Discount Percentage</label>
          <Input
            type="number"
            min="0"
            max="100"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(Number(e.target.value))}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Base Price</TableHead>
            <TableHead>Current Discount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product: any) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>₦{product.basePrice}</TableCell>
              <TableCell>
                {product.discount ? `${product.discount}%` : "No discount"}
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleApplyDiscount(product.id)}
                  variant="outline"
                  size="sm"
                >
                  Apply Discount
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductDiscount;