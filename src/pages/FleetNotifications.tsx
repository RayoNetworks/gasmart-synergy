import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, CheckCircle } from 'lucide-react';

const FleetNotifications = () => {
  // Sample notifications - in a real app, these would come from your backend
  const notifications = [
    {
      id: 1,
      title: "Geofence Exit Alert",
      message: "Truck 001 has left Manhattan Zone",
      type: "warning",
      timestamp: "2 minutes ago"
    },
    {
      id: 2,
      title: "Low Fuel Warning",
      message: "Truck 002 fuel level below 20%",
      type: "danger",
      timestamp: "15 minutes ago"
    },
    {
      id: 3,
      title: "Delivery Completed",
      message: "Truck 003 completed delivery at Brooklyn Zone",
      type: "success",
      timestamp: "1 hour ago"
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <Bell className="h-4 w-4 text-yellow-500" />;
      case 'danger':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getBadge = (type: string) => {
    switch (type) {
      case 'warning':
        return <Badge variant="secondary">Warning</Badge>;
      case 'danger':
        return <Badge variant="destructive">Alert</Badge>;
      case 'success':
        return <Badge variant="default">Success</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Smart Notifications</h1>

      <div className="space-y-4">
        {notifications.map(notification => (
          <Card key={notification.id}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex items-center space-x-4">
                {getIcon(notification.type)}
                <CardTitle className="text-lg">{notification.title}</CardTitle>
              </div>
              <div className="ml-auto">
                {getBadge(notification.type)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FleetNotifications;