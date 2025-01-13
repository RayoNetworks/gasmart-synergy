import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertTriangle, MoreVertical, Truck, BarChart3 } from "lucide-react";
import { toast } from "sonner";

interface TankCardProps {
  tank: {
    id: string;
    name: string;
    product: string;
    capacity: number;
    currentLevel: number;
    lastDelivery: string;
    status: string;
  };
}

const TankCard: React.FC<TankCardProps> = ({ tank }) => {
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

  return (
    <Card>
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
  );
};

export default TankCard;