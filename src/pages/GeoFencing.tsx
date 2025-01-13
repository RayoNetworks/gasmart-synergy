import React from 'react';
import Map from '@/components/Map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const GeoFencing = () => {
  // Sample geofences - in a real app, these would come from your backend
  const geofences = [
    {
      id: 1,
      name: "Manhattan Zone",
      coordinates: [-73.935242, 40.730610] as [number, number],
      radius: "5km"
    },
    {
      id: 2,
      name: "Brooklyn Zone",
      coordinates: [-73.944158, 40.678177] as [number, number],
      radius: "3km"
    }
  ];

  const markers = geofences.map(fence => ({
    coordinates: fence.coordinates,
    title: `${fence.name}<br/>Radius: ${fence.radius}`
  }));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Geo Fence Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Geofence
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {geofences.map(fence => (
          <Card key={fence.id}>
            <CardHeader>
              <CardTitle className="text-lg">{fence.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Radius: {fence.radius}</p>
              <p className="text-sm text-muted-foreground">
                Center: {fence.coordinates[1].toFixed(4)}, {fence.coordinates[0].toFixed(4)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Geofence Map</CardTitle>
        </CardHeader>
        <CardContent>
          <Map 
            center={[-73.935242, 40.730610]}
            zoom={10}
            markers={markers}
            drawGeofence={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default GeoFencing;