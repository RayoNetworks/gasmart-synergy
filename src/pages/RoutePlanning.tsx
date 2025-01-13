import React from 'react';
import Map from '@/components/Map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const RoutePlanning = () => {
  // Sample routes - in a real app, these would come from your backend
  const routes = [
    {
      id: 1,
      name: "Manhattan Delivery Route",
      startPoint: [-74.006, 40.7128] as [number, number],
      endPoint: [-73.935242, 40.730610] as [number, number],
      status: "Active"
    },
    {
      id: 2,
      name: "Brooklyn Delivery Route",
      startPoint: [-73.944158, 40.678177] as [number, number],
      endPoint: [-73.935242, 40.730610] as [number, number],
      status: "Scheduled"
    }
  ];

  const markers = routes.flatMap(route => [
    {
      coordinates: route.startPoint,
      title: `${route.name}<br/>Start Point`
    },
    {
      coordinates: route.endPoint,
      title: `${route.name}<br/>End Point`
    }
  ]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Route Planning</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Route
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routes.map(route => (
          <Card key={route.id}>
            <CardHeader>
              <CardTitle className="text-lg">{route.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Status: {route.status}</p>
              <p className="text-sm text-muted-foreground">
                Start: {route.startPoint[1].toFixed(4)}, {route.startPoint[0].toFixed(4)}
              </p>
              <p className="text-sm text-muted-foreground">
                End: {route.endPoint[1].toFixed(4)}, {route.endPoint[0].toFixed(4)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Route Map</CardTitle>
        </CardHeader>
        <CardContent>
          <Map 
            center={[-73.935242, 40.730610]}
            zoom={10}
            markers={markers}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RoutePlanning;