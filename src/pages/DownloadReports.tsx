import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileSpreadsheet,
  FileText,
  BarChart,
  Calendar,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const DownloadReports = () => {
  const { toast } = useToast();
  const [reportPeriod, setReportPeriod] = useState("this-month");

  const handleDownload = (reportType: string) => {
    toast({
      title: "Downloading Report",
      description: `Preparing ${reportType} report for download...`,
    });
    // Implement actual download logic here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Download Reports</h1>
        <Select value={reportPeriod} onValueChange={setReportPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileSpreadsheet className="mr-2 h-5 w-5" />
              Sales Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Download detailed sales reports including transaction history,
              revenue analysis, and product performance
            </p>
            <Button 
              onClick={() => handleDownload("sales")}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Sales Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5" />
              Inventory Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Get stock levels, inventory movement, and reorder recommendations
            </p>
            <Button 
              onClick={() => handleDownload("inventory")}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Inventory Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Financial Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Access financial statements, profit & loss reports, and cash flow analysis
            </p>
            <Button 
              onClick={() => handleDownload("financial")}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Financial Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Audit Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Download audit trails, system logs, and compliance reports
            </p>
            <Button 
              onClick={() => handleDownload("audit")}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Audit Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DownloadReports;