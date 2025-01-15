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
import { Plus, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface StockAdjustment {
  id: number;
  productName: string;
  productVariationName: string;
  totalStock: number;
  branchName: string;
  registerDate: string;
}

const mockStockData: StockAdjustment[] = [
  {
    id: 1,
    productName: "Xiaomi Redmi 9A - Smartphone",
    productVariationName: "Color black & storage 64gb & ram 4GB",
    totalStock: 5,
    branchName: "Branch1",
    registerDate: "January02, 24",
  },
  {
    id: 2,
    productName: "Adjustable Cell Phone Stand",
    productVariationName: "-",
    totalStock: 5,
    branchName: "Branch",
    registerDate: "January02, 24",
  },
  {
    id: 3,
    productName: "Dual Layer Protective Heavy Duty Cell Phone Cover",
    productVariationName: "-",
    totalStock: 5,
    branchName: "Branch",
    registerDate: "January02, 24",
  },
];

const StockAdjustment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleAddStock = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be implemented soon",
    });
  };

  const filteredStock = mockStockData.filter(
    (stock) =>
      stock.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.productVariationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stock Adjustment</h1>
        <Button onClick={handleAddStock}>
          <Plus className="mr-2 h-4 w-4" /> Add Product Stock
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Product Name, Variation Name, Stock Quantity"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>PRODUCT NAME</TableHead>
              <TableHead>PRODUCT VARIATION NAME</TableHead>
              <TableHead>TOTAL STOCK</TableHead>
              <TableHead>BRANCH NAME</TableHead>
              <TableHead>REGISTER DATE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStock.map((stock) => (
              <TableRow key={stock.id}>
                <TableCell>{stock.id}</TableCell>
                <TableCell>{stock.productName}</TableCell>
                <TableCell>{stock.productVariationName}</TableCell>
                <TableCell>{stock.totalStock}</TableCell>
                <TableCell>{stock.branchName}</TableCell>
                <TableCell>{stock.registerDate}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Edit
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

export default StockAdjustment;