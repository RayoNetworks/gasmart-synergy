import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cloud, Database, Link, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SoftwareIntegration = () => {
  const { toast } = useToast();

  const handleConnect = (service: string) => {
    toast({
      title: "Connecting...",
      description: `Initiating connection to ${service}`,
    });
    // Implement actual connection logic here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Software Integration</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cloud className="mr-2 h-5 w-5" />
              Google Drive Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect to Google Drive for automatic backup and document storage
            </p>
            <Button onClick={() => handleConnect("google-drive")}>
              Connect Google Drive
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              External Database
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dbConnection">Connection String</Label>
              <Input
                id="dbConnection"
                placeholder="postgresql://user:password@localhost:5432/db"
                type="password"
              />
            </div>
            <Button onClick={() => handleConnect("database")}>
              Test Connection
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Link className="mr-2 h-5 w-5" />
              API Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                placeholder="Enter your API key"
                type="password"
              />
            </div>
            <Button onClick={() => handleConnect("api")}>
              Verify API Key
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure security settings for external integrations
            </p>
            <Button onClick={() => handleConnect("security")}>
              Configure Security
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SoftwareIntegration;