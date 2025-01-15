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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Eye, Pencil, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface StockTransfer {
  id: number;
  productName: string;
  fromBranch: string;
  toBranch: string;
  price: number;
  quantity: number;
  transferStatus: string;
  transferDate: string;
}

const mockTransferData: StockTransfer[] = [
  {
    id: 1,
    productName: "Realme GT Neo 2 5G Dual",
    fromBranch: "Branch",
    toBranch: "Branch1",
    price: 2000,
    quantity: 2,
    transferStatus: "Pending",
    transferDate: "January02, 24",
  },
  {
    id: 2,
    productName: "Xiaomi Redmi Note 10 Pro",
    fromBranch: "Branch",
    toBranch: "Branch1",
    price: 18000,
    quantity: 3,
    transferStatus: "Pending",
    transferDate: "January02, 24",
  },
  {
    id: 3,
    productName: "Samsung Galaxy M32",
    fromBranch: "Branch1",
    toBranch: "Branch",
    price: 2000,
    quantity: 3,
    transferStatus: "Pending",
    transferDate: "January02, 24",
  },
  {
    id: 4,
    productName: "Adjustable Cell Phone Stand",
    fromBranch: "Branch",
    toBranch: "Branch1",
    price: 400,
    quantity: 1,
    transferStatus: "Send",
    transferDate: "January13, 25",
  },
];

const StockTransfer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const { toast } = useToast();

  const handleAddTransfer = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be implemented soon",
    });
  };

  const filteredTransfers = mockTransferData.filter(
    (transfer) =>
      transfer.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === "All" || transfer.transferStatus === filterStatus)
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stock Transfer</h1>
        <Button onClick={handleAddTransfer}>
          <Plus className="mr-2 h-4 w-4" /> Add Stock Transfer
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Product"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={filterStatus}
          onValueChange={setFilterStatus}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Send">Send</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-primary/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>PRODUCT NAME</TableHead>
              <TableHead>FROM BRANCH</TableHead>
              <TableHead>TO BRANCH</TableHead>
              <TableHead>PRICE</TableHead>
              <TableHead>QUANTITY</TableHead>
              <TableHead>TRANSFER STATUS</TableHead>
              <TableHead>TRANSFER DATE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransfers.map((transfer) => (
              <TableRow key={transfer.id}>
                <TableCell>{transfer.id}</TableCell>
                <TableCell>{transfer.productName}</TableCell>
                <TableCell>{transfer.fromBranch}</TableCell>
                <TableCell>{transfer.toBranch}</TableCell>
                <TableCell>{transfer.price}</TableCell>
                <TableCell>{transfer.quantity}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      transfer.transferStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {transfer.transferStatus}
                  </span>
                </TableCell>
                <TableCell>{transfer.transferDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockTransfer;