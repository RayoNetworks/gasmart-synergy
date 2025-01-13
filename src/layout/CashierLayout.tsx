import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  LogOut, 
  Fuel, 
  Plus, 
  Search, 
  CreditCard, 
  Receipt,
  Printer,
  Ban,
  ShoppingCart
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CashierLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderId] = useState("ORD" + Math.floor(1000 + Math.random() * 9000));
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const handleLogout = () => {
    logout();
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="border-b p-4 flex justify-between items-center bg-white">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Point of Sale</h1>
          <Badge variant="outline">{orderId}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString()}
          </span>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Side - Cart */}
        <div className="w-2/3 border-r p-4 flex flex-col">
          {/* Customer Selection */}
          <div className="flex gap-4 mb-4">
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Walk In Customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="walk-in">Walk In Customer</SelectItem>
                <SelectItem value="registered">Registered Customer</SelectItem>
              </SelectContent>
            </Select>
            <Button size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-8" />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <Fuel className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-medium">PMS (Petrol)</h3>
                  <p className="text-sm text-muted-foreground">₦500/Ltr</p>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <Fuel className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-medium">AGO (Diesel)</h3>
                  <p className="text-sm text-muted-foreground">₦650/Ltr</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart Table */}
          <div className="flex-1 border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2">Product</th>
                  <th className="text-right p-2">Qty (Ltrs)</th>
                  <th className="text-right p-2">Price</th>
                  <th className="text-right p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2" colSpan={4}>No items in cart</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side - Totals & Actions */}
        <div className="w-1/3 p-4 flex flex-col">
          <div className="space-y-4 flex-1">
            <div className="flex justify-between py-2">
              <span>Items</span>
              <span>0</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Sub Total</span>
              <span>₦0.00</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Tax</span>
              <span>₦0.00</span>
            </div>
            <div className="flex justify-between py-2 font-bold">
              <span>Total</span>
              <span>₦0.00</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button className="flex items-center gap-2" variant="outline">
              <Ban className="h-4 w-4" />
              Cancel
            </Button>
            <Button className="flex items-center gap-2" variant="outline">
              <ShoppingCart className="h-4 w-4" />
              Hold
            </Button>
            <Button className="flex items-center gap-2" variant="outline">
              <Receipt className="h-4 w-4" />
              Quotation
            </Button>
            <Button className="flex items-center gap-2" variant="outline">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button className="flex items-center gap-2 col-span-2" variant="default">
              <CreditCard className="h-4 w-4" />
              Pay Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierLayout;