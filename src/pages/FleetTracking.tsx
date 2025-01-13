import React from 'react';
import Map from '@/components/Map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FleetTracking = () => {
  // Sample data - in a real app, this would come from your backend
  const vehicles = [
    {
      id: 1,
      name: "Truck 001",
      coordinates: [-74.5, 40] as [number, number],
      status: "In Transit"
    },
    {
      id: 2,
      name: "Truck 002",
      coordinates: [-73.935242, 40.730610] as [number, number],
      status: "Delivering"
    }
  ];

  const markers = vehicles.map(vehicle => ({
    coordinates: vehicle.coordinates,
    title: `${vehicle.name}<br/>Status: ${vehicle.status}`
  }));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Real-time Fleet Movement</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {vehicles.map(vehicle => (
          <Card key={vehicle.id}>
            <CardHeader>
              <CardTitle className="text-lg">{vehicle.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Status: {vehicle.status}</p>
              <p className="text-sm text-muted-foreground">
                Location: {vehicle.coordinates[1].toFixed(4)}, {vehicle.coordinates[0].toFixed(4)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Map</CardTitle>
        </CardHeader>
        <CardContent>
          <Map 
            center={[-74, 40.7]}
            zoom={8}
            markers={markers}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FleetTracking;