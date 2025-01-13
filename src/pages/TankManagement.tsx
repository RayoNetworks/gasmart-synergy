import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/axios";
import TankCard from "@/components/tank/TankCard";
import DeliveryLogs from "@/components/tank/DeliveryLogs";

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const allDeliveryLogs = tanks?.flatMap((tank: any) => tank.deliveryLogs) || [];

  return (
    <div className="space-y-6 p-6">
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
            {tanks?.map((tank: any) => (
              <TankCard key={tank.id} tank={tank} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deliveries">
          <DeliveryLogs logs={allDeliveryLogs} />
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