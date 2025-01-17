import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ClipboardCheck, 
  Search,
  FileCheck,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AuditSales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const { data: salesData, isLoading } = useQuery({
    queryKey: ["audit-sales", searchTerm, dateFilter],
    queryFn: async () => {
      console.log("Fetching audit sales data");
      const response = await axiosClient.get("/sales/audit", {
        params: {
          search: searchTerm,
          dateFilter,
        },
      });
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sales Audit</h1>
        <Button>
          <FileCheck className="mr-2 h-4 w-4" /> Export Audit Report
        </Button>
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Cashier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Discrepancies</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesData?.map((sale: any) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.transactionId}</TableCell>
                <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                <TableCell>₦{sale.amount.toFixed(2)}</TableCell>
                <TableCell>{sale.cashier}</TableCell>
                <TableCell>
                  <Badge
                    variant={sale.status === "verified" ? "default" : "destructive"}
                  >
                    {sale.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {sale.discrepancies ? (
                    <span className="flex items-center text-red-500">
                      <AlertTriangle className="mr-1 h-4 w-4" />
                      {sale.discrepancies}
                    </span>
                  ) : (
                    <span className="flex items-center text-green-500">
                      <ClipboardCheck className="mr-1 h-4 w-4" />
                      None
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    View Details
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

export default AuditSales;