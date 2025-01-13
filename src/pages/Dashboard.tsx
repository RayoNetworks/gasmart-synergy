import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, Fuel, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const Dashboard = () => {
  // Sample data for the heatmap (you would fetch this from your backend)
  const heatmapData = [
    { hour: "6am", value: 30 },
    { hour: "9am", value: 45 },
    { hour: "12pm", value: 75 },
    { hour: "3pm", value: 90 },
    { hour: "6pm", value: 60 },
    { hour: "9pm", value: 35 },
  ];

  // Sample data for tank capacity
  const tankData = [
    { tank: "Tank 1", stock: 35000, capacity: 50000 },
    { tank: "Tank 2", stock: 42000, capacity: 50000 },
    { tank: "Tank 3", stock: 28000, capacity: 50000 },
    { tank: "Tank 4", stock: 31000, capacity: 50000 },
    { tank: "Tank 5", stock: 39000, capacity: 50000 },
  ];

  // Sample data for daily closure
  const closureData = [
    { date: "27 Jan", amount: 2100 },
    { date: "28 Jan", amount: 2400 },
    { date: "29 Jan", amount: 2780 },
    { date: "30 Jan", amount: 2500 },
    { date: "31 Jan", amount: 2800 },
    { date: "01 Feb", amount: 1900 },
    { date: "02 Feb", amount: 2680 },
    { date: "03 Feb", amount: 2350 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hello, Admin 👋</h1>
          <p className="text-muted-foreground">
            Please take a quick look at the summary of your stations.
          </p>
        </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          {/* Product Stock Gauges */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Premium Motor Spirit</CardTitle>
                <Fuel className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,556.00 Ltr</div>
                <p className="text-xs text-muted-foreground">₦15,200.00</p>
                <Progress value={35} className="mt-2" indicatorClassName="bg-yellow-500" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Automotive Gas Oil</CardTitle>
                <Fuel className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5,076.00 Ltr</div>
                <p className="text-xs text-muted-foreground">₦30,125.00</p>
                <Progress value={65} className="mt-2" indicatorClassName="bg-green-500" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dual Purpose Kerosene</CardTitle>
                <Fuel className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">75,322.00 Ltr</div>
                <p className="text-xs text-muted-foreground">₦65,120.00</p>
                <Progress value={85} className="mt-2" indicatorClassName="bg-blue-500" />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Tank Capacity Chart */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Tank Capacity</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tankData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tank" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="stock" fill="#3b82f6" name="Stock Level" />
                    <Bar dataKey="capacity" fill="#e5e7eb" name="Total Capacity" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Day Closure Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Day Closure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-4">₦ 2,780.06</div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={closureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Content</CardTitle>
            </CardHeader>
            <CardContent>
              Sales metrics and charts will go here
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add other tab contents similarly */}
      </Tabs>
    </div>
  );
};

export default Dashboard;