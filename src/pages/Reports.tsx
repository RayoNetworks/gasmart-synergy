import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
  // Sample data - in a real app, this would come from your backend
  const salesData = [
    { month: "Jan", sales: 4000000 },
    { month: "Feb", sales: 3000000 },
    { month: "Mar", sales: 2000000 },
    { month: "Apr", sales: 2780000 },
    { month: "May", sales: 1890000 },
    { month: "Jun", sales: 2390000 },
  ];

  const stockData = [
    {
      id: 1,
      product: "LPG Cylinder 13kg",
      currentStock: 48,
      reorderPoint: 20,
      status: "Healthy",
    },
    {
      id: 2,
      product: "LPG Cylinder 5kg",
      currentStock: 12,
      reorderPoint: 15,
      status: "Low Stock",
    },
    {
      id: 3,
      product: "Diesel",
      currentStock: 2500,
      reorderPoint: 1000,
      status: "Healthy",
    },
    {
      id: 4,
      product: "Petrol",
      currentStock: 1800,
      reorderPoint: 1000,
      status: "Healthy",
    },
  ];

  const customerData = [
    {
      id: 1,
      name: "John Smith",
      totalPurchases: 12500000,
      lastPurchase: "2024-03-15",
      type: "Business",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      totalPurchases: 8200000,
      lastPurchase: "2024-03-18",
      type: "Residential",
    },
    {
      id: 3,
      name: "Tech Solutions Inc",
      totalPurchases: 25000000,
      lastPurchase: "2024-03-20",
      type: "Business",
    },
    {
      id: 4,
      name: "Mike Wilson",
      totalPurchases: 3500000,
      lastPurchase: "2024-03-19",
      type: "Residential",
    },
  ];

  // ... keep existing code (JSX structure)

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
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales Overview</CardTitle>
              <CardDescription>Monthly sales performance analysis</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value) => [`₦${value.toLocaleString()}`, "Sales"]} />
                  <Bar dataKey="sales" fill="#facc15" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
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
