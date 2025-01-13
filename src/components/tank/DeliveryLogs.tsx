import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck } from "lucide-react";

interface DeliveryLog {
  id: string;
  date: string;
  quantity: number;
  supplier: string;
  productType: string;
  status: string;
}

interface DeliveryLogsProps {
  logs: DeliveryLog[];
}

const DeliveryLogs: React.FC<DeliveryLogsProps> = ({ logs }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log) => (
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryLogs;