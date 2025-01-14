import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Calendar, Eye, GitBranch, RotateCcw, Store } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const UserList = () => {
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedOutlet, setSelectedOutlet] = useState<string>("");
  const [selectedUserType, setSelectedUserType] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);

  // Fetch branches for filter
  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const response = await axiosClient.get("/branches");
      return response.data;
    },
  });

  // Fetch outlets for filter
  const { data: outlets } = useQuery({
    queryKey: ["outlets"],
    queryFn: async () => {
      const response = await axiosClient.get("/outlets");
      return response.data;
    },
  });

  // Fetch users with filters
  const { data: users, refetch } = useQuery({
    queryKey: ["users", selectedBranch, selectedOutlet, selectedUserType, selectedDate],
    queryFn: async () => {
      const response = await axiosClient.get("/users", {
        params: {
          branch: selectedBranch,
          outlet: selectedOutlet,
          userType: selectedUserType,
          createdAt: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
        },
      });
      return response.data;
    },
  });

  const handleViewBranch = (branchId: string) => {
    // navigate(`/admin/branch/${branchId}`);
    navigate(`/admin/branch`);
  };

  const handleViewOutlet = (outletId: string) => {
    // navigate(`/admin/outlets/${outletId}`);
    navigate(`/admin/outlets`);
  };

  const handleViewUserDetails = (user: any) => {
    setSelectedUser(user);
    setIsViewSheetOpen(true);
  };

  const handleReset = () => {
    setSelectedBranch("");
    setSelectedOutlet("");
    setSelectedUserType("");
    setSelectedDate(undefined);
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User List</h1>
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Filters
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <Select value={selectedUserType} onValueChange={setSelectedUserType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select user type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="working_client">Working Client</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
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

        <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
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

      {/* Users Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>User Type</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Outlet</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell className="capitalize">{user.userType}</TableCell>
                <TableCell>{user.branch?.name}</TableCell>
                <TableCell>{user.outlet?.name}</TableCell>
                <TableCell>
                  {format(new Date(user.createdAt), "PPP")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewUserDetails(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-fit px-2 py-1">
                        View Details
                      </HoverCardContent>
                    </HoverCard>

                    {user.branch && (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewBranch(user.branch.id)}
                          >
                            <GitBranch className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-fit px-2 py-1">
                          View Branch
                        </HoverCardContent>
                      </HoverCard>
                    )}

                    {user.outlet && (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewOutlet(user.outlet.id)}
                          >
                            <Store className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-fit px-2 py-1">
                          View Outlet
                        </HoverCardContent>
                      </HoverCard>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View User Details Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>User Details</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="text-sm font-medium">Name</h4>
              <p>{selectedUser?.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Email</h4>
              <p>{selectedUser?.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Phone</h4>
              <p>{selectedUser?.phone}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">User Type</h4>
              <p className="capitalize">{selectedUser?.userType}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Branch</h4>
              <p>{selectedUser?.branch?.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Outlet</h4>
              <p>{selectedUser?.outlet?.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Created At</h4>
              <p>
                {selectedUser?.createdAt &&
                  format(new Date(selectedUser.createdAt), "PPP")}
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default UserList;