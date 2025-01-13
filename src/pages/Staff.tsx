import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/axios";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Eye, Pencil, Trash2, Plus, RotateCcw } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const Staff = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);

  // Fetch branches for filter
  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const response = await axiosClient.get("/branches");
      return response.data;
    },
  });

  // Modified to filter outlets based on selected branch
  const { data: outlets } = useQuery({
    queryKey: ["outlets", selectedBranch],
    queryFn: async () => {
      if (!selectedBranch) return [];
      console.log("Fetching outlets for branch:", selectedBranch);
      const response = await axiosClient.get("/outlets", {
        params: { branchId: selectedBranch }
      });
      console.log("Available outlets:", response.data);
      return response.data;
    },
    enabled: !!selectedBranch,
  });

  // Fetch staff with filters
  const { data: staffList, refetch } = useQuery({
    queryKey: ["staff", nameFilter, emailFilter, selectedBranch, selectedOutlet, selectedDate],
    queryFn: async () => {
      const response = await axiosClient.get("/users", {
        params: {
          userType: "staff",
          name: nameFilter || undefined,
          email: emailFilter || undefined,
          branch: selectedBranch || undefined,
          outlet: selectedOutlet || undefined,
          createdAt: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
        },
      });
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (staffId: string) => axiosClient.delete(`/users/${staffId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({
        title: "Success",
        description: "Staff member deleted successfully",
      });
      setStaffToDelete(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (staffToDelete) {
      deleteMutation.mutate(staffToDelete);
    }
  };

  const handleReset = () => {
    setNameFilter("");
    setEmailFilter("");
    setSelectedBranch("");
    setSelectedOutlet("");
    setSelectedDate(undefined);
    refetch();
  };

  const handleBranchChange = (branchId: string) => {
    console.log("Branch changed to:", branchId);
    setSelectedBranch(branchId);
    setSelectedOutlet(""); // Reset outlet when branch changes
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Filters
          </Button>
          <Button
            onClick={() => navigate("/admin/crm/staff/create")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Staff
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="w-[200px]"
        />
        <Input
          placeholder="Filter by email"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          className="w-[200px]"
        />
        <Select value={selectedBranch} onValueChange={handleBranchChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            {branches?.map((branch: any) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={selectedOutlet} 
          onValueChange={setSelectedOutlet}
          disabled={!selectedBranch}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select outlet" />
          </SelectTrigger>
          <SelectContent>
            {outlets?.map((outlet: any) => (
              <SelectItem key={outlet.id} value={outlet.id}>
                {outlet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] flex justify-between">
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              <Calendar className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Staff Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Outlet</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffList?.map((staff: any) => (
              <TableRow key={staff.id}>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.phone}</TableCell>
                <TableCell>{staff.branch?.name}</TableCell>
                <TableCell>{staff.outlet?.name}</TableCell>
                <TableCell>{format(new Date(staff.createdAt), "PPP")}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedStaff(staff);
                        setIsViewSheetOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/crm/staff/${staff.id}/edit`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setStaffToDelete(staff.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!staffToDelete}
        onOpenChange={() => setStaffToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the staff
              member.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Staff Details Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Staff Details</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="text-sm font-medium">Name</h4>
              <p>{selectedStaff?.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Email</h4>
              <p>{selectedStaff?.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Phone</h4>
              <p>{selectedStaff?.phone}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Branch</h4>
              <p>{selectedStaff?.branch?.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Outlet</h4>
              <p>{selectedStaff?.outlet?.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Created At</h4>
              <p>
                {selectedStaff?.createdAt &&
                  format(new Date(selectedStaff.createdAt), "PPP")}
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Staff;
