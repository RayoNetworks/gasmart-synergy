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
import { Plus } from "lucide-react";

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const recentSales = [
    {
      id: 1,
      product: "LPG Cylinder 13kg",
      quantity: 2,
      amount: 120.00,
      date: "2024-03-20",
      status: "Completed"
    },
    {
      id: 2,
      product: "Diesel",
      quantity: 50,
      amount: 275.50,
      date: "2024-03-20",
      status: "Completed"
    },
    {
      id: 3,
      product: "Petrol",
      quantity: 30,
      amount: 180.00,
      date: "2024-03-19",
      status: "Completed"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sales</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Sale
        </Button>
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
              <TableHead>ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.id}</TableCell>
                <TableCell>{sale.product}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>${sale.amount.toFixed(2)}</TableCell>
                <TableCell>{sale.date}</TableCell>
                <TableCell>{sale.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Sales;