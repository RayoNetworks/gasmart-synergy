import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer, Usb, HardDrive, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const HardwareIntegration = () => {
  const { toast } = useToast();
  const [printerIP, setPrinterIP] = useState("");
  const [scanning, setScanning] = useState(false);

  const handleConnect = (device: string) => {
    toast({
      title: "Connecting...",
      description: `Attempting to connect to ${device}`,
    });
    // Implement actual connection logic here
  };

  const scanDevices = () => {
    setScanning(true);
    toast({
      title: "Scanning for devices",
      description: "Please wait while we scan for available hardware",
    });
    
    // Simulate scanning
    setTimeout(() => {
      setScanning(false);
      toast({
        title: "Scan complete",
        description: "Found 3 available devices",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hardware Integration</h1>
        <Button onClick={scanDevices} disabled={scanning}>
          <RefreshCw className={`mr-2 h-4 w-4 ${scanning ? "animate-spin" : ""}`} />
          {scanning ? "Scanning..." : "Scan for Devices"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Printer className="mr-2 h-5 w-5" />
              Receipt Printer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="printerIP">Printer IP Address</Label>
              <Input
                id="printerIP"
                placeholder="192.168.1.100"
                value={printerIP}
                onChange={(e) => setPrinterIP(e.target.value)}
              />
            </div>
            <Button onClick={() => handleConnect("printer")}>
              Connect Printer
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Usb className="mr-2 h-5 w-5" />
              USB Devices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Connect barcode scanners, card readers, and other USB devices
              </p>
            </div>
            <Button onClick={() => handleConnect("usb")}>
              Configure USB Devices
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HardDrive className="mr-2 h-5 w-5" />
              Storage Devices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Configure external storage devices and backup drives
              </p>
            </div>
            <Button onClick={() => handleConnect("storage")}>
              Configure Storage
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HardwareIntegration;