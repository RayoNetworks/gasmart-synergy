import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  purchaseDate: string;
}

// Mock data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "LPG Cylinder 13kg",
    price: 60.00,
    quantity: 2,
    purchaseDate: "2024-02-15",
  },
  {
    id: "2",
    name: "Diesel",
    price: 550.50,
    quantity: 100,
    purchaseDate: "2024-02-10",
  },
  {
    id: "3",
    name: "Petrol",
    price: 600.00,
    quantity: 50,
    purchaseDate: "2024-02-01",
  },
];

const CustomerProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Customer Products</h1>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>₦{product.price.toFixed(2)}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{new Date(product.purchaseDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate('/admin/products')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomerProducts;