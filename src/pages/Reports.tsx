import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Reports = () => {
  // Sample data for last 10 days sales and purchases
  const last10DaysData = [
    { date: "Jan 1", sales: 4, purchases: 3 },
    { date: "Jan 2", sales: 6, purchases: 4 },
    { date: "Jan 3", sales: 8, purchases: 5 },
    { date: "Jan 4", sales: 15, purchases: 8 },
    { date: "Jan 5", sales: 12, purchases: 7 },
    { date: "Jan 6", sales: 5, purchases: 4 },
    { date: "Jan 7", sales: 13, purchases: 9 },
    { date: "Jan 8", sales: 8, purchases: 6 },
    { date: "Jan 9", sales: 6, purchases: 4 },
    { date: "Jan 10", sales: 4, purchases: 3 },
  ];

  // Sample data for top selling products
  const topSellingProducts = [
    {
      product: "LPG Cylinder 12.5kg",
      quantity: 70,
      total: 816634,
    },
    {
      product: "LPG Cylinder 6kg",
      quantity: 36,
      total: 1309564,
    },
    {
      product: "Gas Stove Double Burner",
      quantity: 33,
      total: 1341340,
    },
    {
      product: "Gas Regulator",
      quantity: 16,
      total: 1435426,
    },
    {
      product: "Hose Pipe (2m)",
      quantity: 15,
      total: 1523426,
    },
  ];

  // Add the missing stock data
  const stockData = [
    {
      id: 1,
      product: "LPG Cylinder 12.5kg",
      currentStock: 45,
      reorderPoint: 20,
      status: "In Stock"
    },
    {
      id: 2,
      product: "LPG Cylinder 6kg",
      currentStock: 15,
      reorderPoint: 25,
      status: "Low Stock"
    },
    {
      id: 3,
      product: "Gas Stove Double Burner",
      currentStock: 30,
      reorderPoint: 15,
      status: "In Stock"
    },
    {
      id: 4,
      product: "Gas Regulator",
      currentStock: 50,
      reorderPoint: 20,
      status: "In Stock"
    }
  ];

  // Add the missing customer data
  const customerData = [
    {
      id: 1,
      name: "John Doe",
      totalPurchases: 250000,
      lastPurchase: "2024-01-10",
      type: "Business"
    },
    {
      id: 2,
      name: "Jane Smith",
      totalPurchases: 150000,
      lastPurchase: "2024-01-09",
      type: "Residential"
    },
    {
      id: 3,
      name: "Acme Corp",
      totalPurchases: 500000,
      lastPurchase: "2024-01-08",
      type: "Business"
    },
    {
      id: 4,
      name: "Sarah Johnson",
      totalPurchases: 75000,
      lastPurchase: "2024-01-07",
      type: "Residential"
    }
  ];

  // ... keep existing code (return statement and JSX)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="crm">CRM</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-5">
              <CardHeader>
                <CardTitle>Last 10 Day's Sales & Purchases</CardTitle>
                <CardDescription>Daily comparison of sales and purchase activities</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={last10DaysData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} units`]}
                      labelStyle={{ color: "#000" }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#facc15" 
                      strokeWidth={2}
                      dot={{ fill: "#facc15" }}
                      name="Sales"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="purchases" 
                      stroke="#000000" 
                      strokeWidth={2}
                      dot={{ fill: "#000000" }}
                      name="Purchases"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Best performing items</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topSellingProducts.map((product) => (
                      <TableRow key={product.product}>
                        <TableCell className="font-medium">{product.product}</TableCell>
                        <TableCell className="text-right">{product.quantity}</TableCell>
                        <TableCell className="text-right">₦{product.total.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Level Analysis</CardTitle>
              <CardDescription>Current inventory status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Reorder Point</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.product}</TableCell>
                      <TableCell>{item.currentStock}</TableCell>
                      <TableCell>{item.reorderPoint}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.status === "Low Stock"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analysis</CardTitle>
              <CardDescription>Customer purchase history and segmentation</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Total Purchases</TableHead>
                    <TableHead>Last Purchase</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>₦{customer.totalPurchases.toLocaleString()}</TableCell>
                      <TableCell>{customer.lastPurchase}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            customer.type === "Business"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {customer.type}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
