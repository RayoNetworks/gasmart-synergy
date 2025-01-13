import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/axios";
import { toast } from "sonner";
import {
  Droplet,
  MoreVertical,
  AlertTriangle,
  Truck,
  History,
  BarChart3,
  RefreshCw,
} from "lucide-react";

interface Tank {
  id: string;
  name: string;
  product: string;
  capacity: number;
  currentLevel: number;
  lastDelivery: string;
  status: "ACTIVE" | "MAINTENANCE" | "OFFLINE";
  deliveryLogs: DeliveryLog[];
}

interface DeliveryLog {
  id: string;
  date: string;
  quantity: number;
  supplier: string;
  productType: string;
  status: "COMPLETED" | "PENDING" | "CANCELLED";
}

const TankManagement = () => {
  const [selectedTab, setSelectedTab] = useState("overview");

  const { data: tanks, isLoading, refetch } = useQuery({
    queryKey: ["tanks"],
    queryFn: async () => {
      console.log("Fetching tanks data");
      const response = await axiosClient.get("/tanks");
      console.log("Tanks data received:", response.data);
      return response.data;
    },
  });

  const getLevelColor = (level: number) => {
    if (level < 20) return "bg-red-500";
    if (level < 40) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleDelivery = (tankId: string) => {
    console.log("Scheduling delivery for tank:", tankId);
    toast.success("Delivery scheduled successfully");
  };

  const handleCalibrate = (tankId: string) => {
    console.log("Calibrating tank:", tankId);
    toast.success("Tank calibration initiated");
  };

  if (isLoading) {
    return <div>Loading tanks data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tank Management</h1>
        <Button 
          className="flex items-center gap-2"
          onClick={() => {
            console.log("Refreshing tanks data");
            refetch();
          }}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tanks?.map((tank: Tank) => (
              <Card key={tank.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tank {tank.name}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleDelivery(tank.id)}>
                        <Truck className="mr-2 h-4 w-4" />
                        Schedule Delivery
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCalibrate(tank.id)}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Calibrate Tank
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {tank.product}
                      </span>
                      <Badge
                        variant={tank.status === "ACTIVE" ? "default" : "destructive"}
                      >
                        {tank.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Level</span>
                        <span>{tank.currentLevel}%</span>
                      </div>
                      <Progress
                        value={tank.currentLevel}
                        className={getLevelColor(tank.currentLevel)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Capacity</p>
                        <p className="font-medium">{tank.capacity.toLocaleString()} L</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Delivery</p>
                        <p className="font-medium">{tank.lastDelivery}</p>
                      </div>
                    </div>
                    {tank.currentLevel < 20 && (
                      <div className="flex items-center gap-2 text-red-500">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">Low level alert</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deliveries">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tanks?.flatMap((tank: Tank) =>
                  tank.deliveryLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between border-b pb-4"
                    >
                      <div className="flex items-center gap-4">
                        <Truck className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{log.productType}</p>
                          <p className="text-sm text-muted-foreground">
                            {log.supplier}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{log.quantity.toLocaleString()} L</p>
                        <p className="text-sm text-muted-foreground">{log.date}</p>
                      </div>
                      <Badge
                        variant={
                          log.status === "COMPLETED"
                            ? "default"
                            : log.status === "PENDING"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {log.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Tank Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground">
                Analytics features coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TankManagement;