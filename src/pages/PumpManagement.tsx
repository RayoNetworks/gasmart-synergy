import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { 
  Gauge, 
  AlertCircle, 
  Plus, 
  MoreVertical, 
  tool, 
  Power, 
  History,
  Droplets,
  Ban,
  CheckCircle2,
  Eye
} from "lucide-react";

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
  issue?: string;
  lastCalibration?: string;
  fuelFlow?: number;
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
  {
    id: "PMP003",
    code: "PMP/25",
    product: "AGO",
    model: "2024/PMP/003",
    serialNo: "SN123457",
    attendant: {
      name: "Sarah Connor",
      image: "/placeholder.svg"
    },
    startReading: 1500.00,
    endReading: 1550.35,
    price: 95.20,
    totalSale: 620.80,
    totalQty: 180,
    lastMaintenance: "10 Dec 03:45 PM",
    nextMaintenance: "25 Mar 12:00 PM",
    status: "MAINTENANCE"
  },
  {
    id: "PMP004",
    code: "PMP/26",
    product: "PMS",
    model: "2024/PMP/004",
    serialNo: "SN123458",
    attendant: {
      name: "John Smith",
      image: "/placeholder.svg"
    },
    startReading: 3000.00,
    endReading: 3000.00,
    price: 83.10,
    totalSale: 0,
    totalQty: 0,
    lastMaintenance: "15 Dec 09:30 AM",
    nextMaintenance: "28 Mar 12:00 PM",
    status: "OFFLINE"
  }
];

const PumpManagement = () => {
  const [pumps, setPumps] = useState<Pump[]>(mockPumps);
  const [selectedPump, setSelectedPump] = useState<Pump | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRepairDialogOpen, setIsRepairDialogOpen] = useState(false);

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

  const getPumpIcon = (status: Pump["status"]) => {
    if (status === "FUNCTIONING") {
      return (
        <div className="relative w-32 h-40">
          <div className="absolute bottom-0 w-full h-28 bg-gradient-to-b from-blue-400 to-blue-600 rounded-t-lg shadow-lg">
            <div className="absolute top-0 right-6 w-6 h-20 bg-green-500 rounded-full shadow-inner animate-pulse">
              <div className="absolute top-0 w-full h-full bg-gradient-to-b from-green-400 to-green-600 rounded-full" />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-gray-800 rounded-full" />
          </div>
          <div className="absolute bottom-0 w-full h-6 bg-gray-800 rounded-b-lg shadow-lg" />
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full animate-ping" />
        </div>
      );
    } else {
      return (
        <div className="relative w-32 h-40">
          <div className="absolute bottom-0 w-full h-28 bg-gradient-to-b from-gray-400 to-gray-600 rounded-t-lg shadow-lg opacity-50">
            <div className="absolute top-0 right-6 w-6 h-20 bg-red-500 rounded-full shadow-inner">
              <div className="absolute top-0 w-full h-full bg-gradient-to-b from-red-400 to-red-600 rounded-full" />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-gray-800 rounded-full" />
          </div>
          <div className="absolute bottom-0 w-full h-6 bg-gray-800 rounded-b-lg shadow-lg opacity-50" />
          <AlertCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 h-12 w-12" />
        </div>
      );
    }
  };

  const handleRepair = (pump: Pump) => {
    const updatedPumps = pumps.map((p) => {
      if (p.id === pump.id) {
        return {
          ...p,
          status: "FUNCTIONING" as const,
          lastMaintenance: new Date().toLocaleString(),
          issue: undefined,
        };
      }
      return p;
    });
    setPumps(updatedPumps);
    setIsRepairDialogOpen(false);
    toast.success("Pump repaired successfully!");
  };

  const handleCalibrate = (pump: Pump) => {
    const updatedPumps = pumps.map((p) => {
      if (p.id === pump.id) {
        return {
          ...p,
          lastCalibration: new Date().toLocaleString(),
        };
      }
      return p;
    });
    setPumps(updatedPumps);
    toast.success("Pump calibrated successfully!");
  };

  const handleShutdown = (pump: Pump) => {
    const updatedPumps = pumps.map((p) => {
      if (p.id === pump.id) {
        return {
          ...p,
          status: "OFFLINE" as const,
        };
      }
      return p;
    });
    setPumps(updatedPumps);
    toast.info("Pump shut down");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pump Management</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Pump
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pumps.map((pump) => (
          <Card 
            key={pump.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">Pump {pump.code}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(pump.status)}>{pump.status}</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setSelectedPump(pump);
                      setIsDialogOpen(true);
                    }}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    {pump.status !== "FUNCTIONING" && (
                      <DropdownMenuItem onClick={() => {
                        setSelectedPump(pump);
                        setIsRepairDialogOpen(true);
                      }}>
                        <Tool className="mr-2 h-4 w-4" />
                        Repair Pump
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleCalibrate(pump)}>
                      <Droplets className="mr-2 h-4 w-4" />
                      Calibrate
                    </DropdownMenuItem>
                    {pump.status === "FUNCTIONING" && (
                      <DropdownMenuItem onClick={() => handleShutdown(pump)}>
                        <Power className="mr-2 h-4 w-4" />
                        Shutdown
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Product:</div>
                  <div className="font-medium">{pump.product}</div>
                  <div className="text-sm text-muted-foreground">Reading:</div>
                  <div className="font-medium">{pump.endReading.toFixed(2)}</div>
                </div>
                {getPumpIcon(pump.status)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedPump && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Pump Details - {selectedPump.code}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                {getPumpIcon(selectedPump.status)}
                <div className="space-y-2">
                  <Label>Product</Label>
                  <div className="font-medium">{selectedPump.product}</div>
                </div>
                <div className="space-y-2">
                  <Label>Model</Label>
                  <div className="font-medium">{selectedPump.model}</div>
                </div>
                <div className="space-y-2">
                  <Label>Serial No</Label>
                  <div className="font-medium">{selectedPump.serialNo}</div>
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <div className="font-medium">₦{selectedPump.price.toFixed(2)}/Ltr</div>
                </div>
                {selectedPump.lastCalibration && (
                  <div className="space-y-2">
                    <Label>Last Calibration</Label>
                    <div className="font-medium">{selectedPump.lastCalibration}</div>
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <img src={selectedPump.attendant.image} alt={selectedPump.attendant.name} className="h-12 w-12 rounded-full" />
                  <div>
                    <Label>Attendant</Label>
                    <div className="font-medium">{selectedPump.attendant.name}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Readings</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Start</div>
                      <div className="font-medium">{selectedPump.startReading.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">End</div>
                      <div className="font-medium">{selectedPump.endReading.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Total Sale</Label>
                  <div className="font-medium">₦{selectedPump.totalSale.toFixed(2)}</div>
                </div>
                <div className="space-y-2">
                  <Label>Total Quantity</Label>
                  <div className="font-medium">{selectedPump.totalQty} Ltr</div>
                </div>
                <div className="space-y-2">
                  <Label>Maintenance Schedule</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Last</div>
                      <div className="font-medium">{selectedPump.lastMaintenance}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Next</div>
                      <div className="font-medium">{selectedPump.nextMaintenance}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={isRepairDialogOpen} onOpenChange={setIsRepairDialogOpen}>
        {selectedPump && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Repair Pump - {selectedPump.code}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
                <p>Are you sure you want to mark this pump as repaired?</p>
              </div>
              {selectedPump.issue && (
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium">Current Issue:</p>
                  <p className="text-sm text-muted-foreground">{selectedPump.issue}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRepairDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleRepair(selectedPump)}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Confirm Repair
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default PumpManagement;
