import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
  ShoppingCart,
  Trash2
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
import { axiosClient } from "@/axios";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

const CashierLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderId] = useState("ORD" + Math.floor(1000 + Math.random() * 9000));
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantity, setQuantity] = useState<number>(0);

  // Fetch fuel products
  const { data: fuelProducts } = useQuery({
    queryKey: ['fuel-products'],
    queryFn: async () => {
      const response = await axiosClient.get("/fuel-products");
      console.log("Fetched fuel products:", response.data);
      return response.data;
    }
  });

  // Fetch customers
  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await axiosClient.get("/customers");
      console.log("Fetched customers:", response.data);
      return response.data;
    }
  });

  const handleLogout = () => {
    logout();
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
    navigate("/login");
  };

  const addToCart = (product: any) => {
    if (quantity <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity",
        variant: "destructive",
      });
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.price }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        quantity: quantity,
        price: product.price,
        total: quantity * product.price
      }]);
    }

    setQuantity(0);
    toast({
      title: "Success",
      description: `Added ${quantity} liters of ${product.name} to cart`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
    toast({
      title: "Success",
      description: "Item removed from cart",
    });
  };

  const calculateSubTotal = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return calculateSubTotal() * 0.075; // 7.5% VAT
  };

  const calculateTotal = () => {
    return calculateSubTotal() + calculateTax();
  };

  const handlePayment = () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Cart is empty",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically integrate with a payment gateway
    toast({
      title: "Processing Payment",
      description: "Payment processing initiated",
    });
  };

  const handlePrintReceipt = () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "No items to print",
        variant: "destructive",
      });
      return;
    }
    // Implement receipt printing logic
    window.print();
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed",
    });
  };

  const filteredProducts = fuelProducts?.filter((product: any) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                {customers?.map((customer: Customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
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
              <Input 
                placeholder="Search products..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {filteredProducts?.map((product: any) => (
              <Card key={product.id} className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 mb-2">
                    <Fuel className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">₦{product.price}/Ltr</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Liters"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      min="0"
                      step="0.1"
                    />
                    <Button onClick={() => addToCart(product)}>Add</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                  <th className="text-right p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr className="border-t">
                    <td className="p-2" colSpan={5}>No items in cart</td>
                  </tr>
                ) : (
                  cart.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2 text-right">{item.quantity}</td>
                      <td className="p-2 text-right">₦{item.price}</td>
                      <td className="p-2 text-right">₦{item.total}</td>
                      <td className="p-2 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side - Totals & Actions */}
        <div className="w-1/3 p-4 flex flex-col">
          <div className="space-y-4 flex-1">
            <div className="flex justify-between py-2">
              <span>Items</span>
              <span>{cart.length}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Sub Total</span>
              <span>₦{calculateSubTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Tax (7.5%)</span>
              <span>₦{calculateTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 font-bold">
              <span>Total</span>
              <span>₦{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              className="flex items-center gap-2" 
              variant="outline"
              onClick={clearCart}
            >
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
            <Button 
              className="flex items-center gap-2" 
              variant="outline"
              onClick={handlePrintReceipt}
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button 
              className="flex items-center gap-2 col-span-2" 
              variant="default"
              onClick={handlePayment}
            >
              <CreditCard className="h-4 w-4" />
              Pay Now (₦{calculateTotal().toFixed(2)})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierLayout;