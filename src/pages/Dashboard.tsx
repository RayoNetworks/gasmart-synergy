<lov-code>
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, DollarSign, Fuel, AlertTriangle, Activity, Box, TrendingUp, FileText, Users, ShoppingCart, Wrench, Boxes as BoxesIcon } from "lucide-react";
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const heatmapData = [
    { hour: "6am", value: 30 },
    { hour: "9am", value: 45 },
    { hour: "12pm", value: 75 },
    { hour: "3pm", value: 90 },
    { hour: "6pm", value: 60 },
    { hour: "9pm", value: 35 },
  ];

  const tankData = [
    { tank: "Tank 1", stock: 35000, capacity: 50000 },
    { tank: "Tank 2", stock: 42000, capacity: 50000 },
    { tank: "Tank 3", stock: 28000, capacity: 50000 },
    { tank: "Tank 4", stock: 31000, capacity: 50000 },
    { tank: "Tank 5", stock: 39000, capacity: 50000 },
  ];

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

  const salesData = [
    { month: "Jan", revenue: 45000, transactions: 120 },
    { month: "Feb", revenue: 52000, transactions: 145 },
    { month: "Mar", revenue: 48000, transactions: 135 },
    { month: "Apr", revenue: 61000, transactions: 160 },
    { month: "May", revenue: 55000, transactions: 150 },
    { month: "Jun", revenue: 67000, transactions: 180 },
  ];

  const stockDistribution = [
    { name: "PMS", value: 35, color: "#FF8B3D" },
    { name: "AGO", value: 25, color: "#4CAF50" },
    { name: "DPK", value: 20, color: "#2196F3" },
    { name: "LPG", value: 20, color: "#9C27B0" },
  ];

  const assetsData = [
    { category: "Dispensers", operational: 45, maintenance: 5 },
    { category: "Storage Tanks", operational: 28, maintenance: 2 },
    { category: "Delivery Trucks", operational: 15, maintenance: 3 },
    { category: "LPG Cylinders", operational: 850, maintenance: 50 },
  ];

  const activityLogs = [
    {
      time: "2 minutes ago",
      action: "Stock Update",
      description: "PMS stock level updated to 35,000 liters",
      type: "update",
    },
    {
      time: "15 minutes ago",
      action: "New Sale",
      description: "₦125,000 sale completed at Lagos Branch",
      type: "sale",
    },
    {
      time: "1 hour ago",
      action: "Maintenance Alert",
      description: "Dispenser #4 scheduled for maintenance",
      type: "alert",
    },
    {
      time: "2 hours ago",
      action: "Price Update",
      description: "AGO price updated to ₦650/liter",
      type: "update",
    },
  ];

  const summaryMetrics = [
    {
      title: "Total Stock Value",
      value: "₦15.2M",
      change: "+12%",
      trend: "up",
      icon: Package,
      description: "Current inventory value",
      onClick: () => navigate("/admin/reports?tab=stock"),
    },
    {
      title: "Monthly Revenue",
      value: "₦8.5M",
      change: "+8%",
      trend: "up",
      icon: DollarSign,
      description: "Revenue this month",
      onClick: () => navigate("/admin/sales"),
    },
    {
      title: "Active Customers",
      value: "1,234",
      change: "+15%",
      trend: "up",
      icon: Users,
      description: "Total active customers",
      onClick: () => navigate("/admin/crm/customers"),
    },
    {
      title: "Pending Orders",
      value: "45",
      change: "-5%",
      trend: "down",
      icon: ShoppingCart,
      description: "Orders awaiting fulfillment",
      onClick: () => navigate("/admin/sales"),
    },
    {
      title: "Low Stock Items",
      value: "12",
      change: "+3",
      trend: "up",
      icon: AlertTriangle,
      description: "Products below reorder point",
      onClick: () => navigate("/admin/products"),
    },
    {
      title: "Active Assets",
      value: "89%",
      change: "+2%",
      trend: "up",
      icon: Box,
      description: "Operational equipment status",
      onClick: () => navigate("/admin/assets/tanks"),
    },
    {
      title: "Maintenance Due",
      value: "8",
      change: "-2",
      trend: "down",
      icon: Wrench,
      description: "Assets requiring maintenance",
      onClick: () => navigate("/admin/assets/pumps"),
    },
    {
      title: "Stock Categories",
      value: "15",
      change: "0",
      trend: "neutral",
      icon: BoxesIcon,
      description: "Active product categories",
      onClick: () => navigate("/admin/products/categories"),
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hello, Admin 👋</h1>
          <p className="text-muted-foreground">
            Here's a comprehensive overview of your business operations.
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {summaryMetrics.map((metric, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={metric.onClick}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <metric.icon className={`h-4 w-4 ${
                    metric.trend === "up" ? "text-green-500" : 
                    metric.trend === "down" ? "text-red-500" : 
                    "text-gray-500"
                  }`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className={`${
                      metric.trend === "up" ? "text-green-500" : 
                      metric.trend === "down" ? "text-red-500" : 
                      "text-gray-500"
                    }`}>
                      {metric.change}
                    </span>
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Stock Status Overview</CardTitle>
                <CardDescription>Current stock levels and distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stockDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stockDistribution.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={
                              index === 0 ? "#22c55e" : 
                              index === 1 ? "#eab308" : 
                              "#ef4444"
                            } 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Status Overview</CardTitle>
                <CardDescription>Equipment and facility status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {assetsData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={
                              index === 0 ? "#3b82f6" : 
                              index === 1 ? "#f97316" : 
                              "#6b7280"
                            } 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦328,000</div>
                <p className="text-xs text-muted-foreground">+12.5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                <Activity className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">890</div>
                <p className="text-xs text-muted-foreground">+5.2% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
                <TrendingUp className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦368.54</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue & Transactions</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#2196F3" name="Revenue" />
                  <Line yAxisId="right" type="monotone" dataKey="transactions" stroke="#4CAF50" name="Transactions" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stockDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stockDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stock Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">PMS Stock Level</span>
                      <span className="text-sm text-yellow-500">35%</span>
                    </div>
                    <Progress value={35} className="bg-yellow-100" indicatorClassName="bg-yellow-500" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">AGO Stock Level</span>
                      <span className="text-sm text-green-500">65%</span>
                    </div>
                    <Progress value={65} className="bg-green-100" indicatorClassName="bg-green-500" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">DPK Stock Level</span>
                      <span className="text-sm text-red-500">15%</span>
                    </div>
                    <Progress value={15} className="bg-red-100" indicatorClassName="bg-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          <div className