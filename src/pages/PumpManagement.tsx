import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gauge, Plus } from "lucide-react";

interface Pump {
  id: string;
  code: string;
  product: string;
  model: string;
  serialNo: string;
  attendant: {
    name: string;
    image: string;
  };
  startReading: number;
  endReading: number;
  price: number;
  totalSale: number;
  totalQty: number;
  lastMaintenance: string;
  nextMaintenance: string;
  status: "FUNCTIONING" | "MAINTENANCE" | "OFFLINE";
}

const mockPumps: Pump[] = [
  {
    id: "PMP002",
    code: "PMP/24",
    product: "Premium Motor Spirit",
    model: "2024/PMP/002",
    serialNo: "SN123456",
    attendant: {
      name: "Ethan Hawke",
      image: "/placeholder.svg"
    },
    startReading: 2154.00,
    endReading: 2182.35,
    price: 83.10,
    totalSale: 418.50,
    totalQty: 135,
    lastMaintenance: "13 Dec 06:11 PM",
    nextMaintenance: "30 Mar 12:00 PM",
    status: "FUNCTIONING"
  },
  // Add more mock pumps as needed
];

const PumpManagement = () => {
  const [pumps, setPumps] = useState<Pump[]>(mockPumps);
  const [selectedPump, setSelectedPump] = useState<Pump | null>(null);

  const getStatusColor = (status: Pump["status"]) => {
    switch (status) {
      case "FUNCTIONING":
        return "bg-green-500";
      case "MAINTENANCE":
        return "bg-yellow-500";
      case "OFFLINE":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pump Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Pump
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Pump</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Pump Code</Label>
                <Input id="code" placeholder="Enter pump code" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="product">Product</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pms">Premium Motor Spirit</SelectItem>
                    <SelectItem value="ago">AGO</SelectItem>
                    <SelectItem value="dpk">DPK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Add more form fields as needed */}
            </div>
            <Button className="w-full">Save Pump</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pumps.map((pump) => (
          <Card key={pump.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">Pump {pump.code}</CardTitle>
              </div>
              <Badge className={getStatusColor(pump.status)}>{pump.status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Product:</span>
                  <span className="text-sm font-medium">{pump.product}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Attendant:</span>
                  <div className="flex items-center space-x-2">
                    <img src={pump.attendant.image} alt={pump.attendant.name} className="h-6 w-6 rounded-full" />
                    <span className="text-sm font-medium">{pump.attendant.name}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Readings:</span>
                  <span className="text-sm font-medium">
                    {pump.startReading.toFixed(2)} - {pump.endReading.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Sale:</span>
                  <span className="text-sm font-medium">₦{pump.totalSale.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Quantity:</span>
                  <span className="text-sm font-medium">{pump.totalQty} Ltr</span>
                </div>
                <div className="pt-2">
                  <div className="text-xs text-muted-foreground">Next Maintenance:</div>
                  <div className="text-sm font-medium">{pump.nextMaintenance}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PumpManagement;