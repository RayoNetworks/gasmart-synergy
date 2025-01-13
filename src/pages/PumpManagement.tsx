import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Gauge, 
  AlertCircle, 
  Plus, 
  MoreVertical, 
  Wrench, 
  Power, 
  History,
  Droplets,
  Ban,
  CheckCircle2,
  Eye
} from "lucide-react";
import { PumpTransactions } from "@/components/pump/PumpTransactions";

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
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  time: string;
  amount: number;
  quantity: number;
  attendant: string;
  status: "completed" | "pending" | "failed";
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
    status: "FUNCTIONING",
    transactions: [
      {
        id: "t1",
        time: "10:30 AM",
        amount: 5000,
        quantity: 25,
        attendant: "John Doe",
        status: "completed"
      },
      {
        id: "t2",
        time: "11:15 AM",
        amount: 3000,
        quantity: 15,
        attendant: "John Doe",
        status: "completed"
      }
    ]
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
    status: "MAINTENANCE",
    transactions: []
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
    status: "OFFLINE",
    transactions: []
  }
];

const addPumpSchema = z.object({
  code: z.string().min(1, "Pump code is required"),
  product: z.string().min(1, "Product is required"),
  model: z.string().min(1, "Model is required"),
  serialNo: z.string().min(1, "Serial number is required"),
});

const PumpManagement = () => {
  const [pumps, setPumps] = useState<Pump[]>(mockPumps);
  const [selectedPump, setSelectedPump] = useState<Pump | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRepairDialogOpen, setIsRepairDialogOpen] = useState(false);
  const [isAddPumpDialogOpen, setIsAddPumpDialogOpen] = useState(false);
  const [selectedPumpTransactions, setSelectedPumpTransactions] = useState<Transaction[]>([]);
  const [isViewingTransactions, setIsViewingTransactions] = useState(false);

  const form = useForm<z.infer<typeof addPumpSchema>>({
    resolver: zodResolver(addPumpSchema),
    defaultValues: {
      code: "",
      product: "",
      model: "",
      serialNo: "",
    },
  });

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
        <div className="relative w-48 h-56 bg-gray-100 rounded-lg shadow-lg p-4">
          {/* Digital Display */}
          <div className="absolute top-4 left-4 right-4 h-24 bg-white border border-gray-200 rounded-md p-2">
            <div className="flex flex-col items-end space-y-1">
              <span className="font-mono text-2xl font-bold text-black">70.00</span>
              <span className="font-mono text-xl text-gray-600">28.31</span>
              <span className="font-mono text-sm text-gray-400">18.500</span>
            </div>
          </div>
          
          {/* Nozzle Icon */}
          <div className="absolute right-4 top-32">
            <div className="relative w-6 h-16">
              <div className="absolute right-0 w-4 h-12 bg-green-500 rounded-full">
                <div className="absolute top-0 w-full h-full bg-gradient-to-b from-green-400 to-green-600 rounded-full" />
              </div>
              <div className="absolute bottom-0 right-1 w-2 h-4 bg-gray-800 rounded-b-sm" />
            </div>
          </div>

          {/* Status Indicator */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-600">ACTIVE</span>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="relative w-48 h-56 bg-gray-100 rounded-lg shadow-lg p-4 opacity-50">
          {/* Digital Display */}
          <div className="absolute top-4 left-4 right-4 h-24 bg-white border border-gray-200 rounded-md p-2">
            <div className="flex flex-col items-end space-y-1">
              <span className="font-mono text-2xl font-bold text-gray-400">00.00</span>
              <span className="font-mono text-xl text-gray-400">00.00</span>
              <span className="font-mono text-sm text-gray-300">00.000</span>
            </div>
          </div>
          
          {/* Nozzle Icon */}
          <div className="absolute right-4 top-32">
            <div className="relative w-6 h-16">
              <div className="absolute right-0 w-4 h-12 bg-red-500 rounded-full">
                <div className="absolute top-0 w-full h-full bg-gradient-to-b from-red-400 to-red-600 rounded-full" />
              </div>
              <div className="absolute bottom-0 right-1 w-2 h-4 bg-gray-800 rounded-b-sm" />
            </div>
          </div>

          {/* Status Indicator */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-xs text-gray-600">OFFLINE</span>
            </div>
          </div>

          <AlertCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 h-12 w-12" />
        </div>
      );
    }
  };

  const handleAddPump = (values: z.infer<typeof addPumpSchema>) => {
    console.log("Adding new pump:", values);
    
    const pump: Pump = {
      id: `PMP${Math.floor(Math.random() * 1000)}`,
      code: values.code,
      product: values.product,
      model: values.model,
      serialNo: values.serialNo,
      attendant: {
        name: "Unassigned",
        image: "/placeholder.svg"
      },
      startReading: 0,
      endReading: 0,
      price: 0,
      totalSale: 0,
      totalQty: 0,
      lastMaintenance: new Date().toLocaleString(),
      nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleString(),
      status: "OFFLINE" as const,
      transactions: []
    };

    setPumps([...pumps, pump]);
    form.reset();
    setIsAddPumpDialogOpen(false);
    toast.success("New pump added successfully!");
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

  const handleBringOnline = (pump: Pump) => {
    const updatedPumps = pumps.map((p) => {
      if (p.id === pump.id) {
        return {
          ...p,
          status: "FUNCTIONING" as const,
        };
      }
      return p;
    });
    setPumps(updatedPumps);
    toast.success("Pump brought online successfully!");
  };

  const handleViewTransactions = (pump: Pump) => {
    setSelectedPumpTransactions(pump.transactions);
    setIsViewingTransactions(true);
    setSelectedPump(pump);
  };

  if (isViewingTransactions && selectedPump) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pump Transactions</h1>
            <p className="text-muted-foreground">
              Viewing transactions for Pump {selectedPump.code}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setIsViewingTransactions(false);
              setSelectedPump(null);
            }}
          >
            Back to Pumps
          </Button>
        </div>
        <PumpTransactions transactions={selectedPumpTransactions} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pump Management</h1>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsAddPumpDialogOpen(true)}
        >
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
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px] bg-white">
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPump(pump);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    {pump.status === "MAINTENANCE" && (
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPump(pump);
                          setIsRepairDialogOpen(true);
                        }}
                      >
                        <Wrench className="mr-2 h-4 w-4" />
                        Repair Pump
                      </DropdownMenuItem>
                    )}
                    {pump.status === "OFFLINE" && (
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBringOnline(pump);
                        }}
                      >
                        <Power className="mr-2 h-4 w-4" />
                        Bring Online
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCalibrate(pump);
                      }}
                    >
                      <Droplets className="mr-2 h-4 w-4" />
                      Calibrate
                    </DropdownMenuItem>
                    {pump.status === "FUNCTIONING" && (
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShutdown(pump);
                        }}
                      >
                        <Power className="mr-2 h-4 w-4" />
                        Shutdown
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleViewTransactions(pump)}>
                      <History className="mr-2 h-4 w-4" />
                      View Transactions
                    </DropdownMenuItem>
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

      <Dialog 
        open={isAddPumpDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            form.reset();
          }
          setIsAddPumpDialogOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Pump</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddPump)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pump Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter pump code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="product"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter pump model" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serialNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter serial number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  form.reset();
                  setIsAddPumpDialogOpen(false);
                }}>
                  Cancel
                </Button>
                <Button type="submit">Add Pump</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedPump(null);
        }}
      >
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

      <Dialog 
        open={isRepairDialogOpen} 
        onOpenChange={(open) => {
          setIsRepairDialogOpen(open);
          if (!open) setSelectedPump(null);
        }}
      >
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
