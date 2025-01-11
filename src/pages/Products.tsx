import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const products = [
    {
      id: 1,
      name: "LPG Cylinder 13kg",
      type: "LPG",
      stock: 48,
      price: 60.00,
      status: "In Stock"
    },
    {
      id: 2,
      name: "LPG Cylinder 5kg",
      type: "LPG",
      stock: 12,
      price: 25.00,
      status: "Low Stock"
    },
    {
      id: 3,
      name: "Diesel",
      type: "Petroleum",
      stock: 2500,
      price: 5.51,
      status: "In Stock"
    },
    {
      id: 4,
      name: "Petrol",
      type: "Petroleum",
      stock: 1800,
      price: 6.00,
      status: "In Stock"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex items-center space-x-2">
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
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.type}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>₦{product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={product.status === "Low Stock" ? "destructive" : "default"}>
                    {product.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Products;