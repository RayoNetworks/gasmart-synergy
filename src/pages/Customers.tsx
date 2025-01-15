import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Package, Building2, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  branchId: string;
  outletId: string;
  branch: {
    id: string;
    name: string;
    address: string;
  };
  outlet: {
    id: string;
    name: string;
    location: string;
  };
}

const Customers = () => {
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await axiosClient.get("/customers");
      console.log("Fetched customers:", response.data);
      return response.data ?? [];
    },
  });

  const handleViewBranch = (branchId: string) => {
    console.log("Viewing branch:", branchId);
    navigate(`/admin/branch?view=${branchId}`);
  };

  const handleViewOutlet = (outletName: string) => {
    console.log("Viewing outlet:", outletName);
    navigate(`/admin/outlets?outletName=${outletName}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      
      <div className="rounded-md border border-primary/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Outlet</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(customers) && customers.map((customer: Customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>
                  <div>
                    <p>{customer.phone}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                </TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>
                  <div>
                    <p>{customer.branch?.name}</p>
                    <p className="text-sm text-gray-500">{customer.branch?.address}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>{customer.outlet?.name}</p>
                    <p className="text-sm text-gray-500">{customer.outlet?.location}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setIsViewSheetOpen(true);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate(`/admin/crm/customers/${customer.id}/edit`)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate(`/admin/crm/customers/${customer.id}/products`)}
                      >
                        <Package className="mr-2 h-4 w-4" />
                        View Products
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewBranch(customer.branchId)}>
                        <Building2 className="mr-2 h-4 w-4" />
                        View Branch
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewOutlet(customer.outlet?.name)}>
                        <MapPin className="mr-2 h-4 w-4" />
                        View Outlet
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Customer Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Customer Details</SheetTitle>
            <SheetDescription>
              Detailed information about the customer
            </SheetDescription>
          </SheetHeader>
          {selectedCustomer && (
            <div className="mt-6 space-y-4">
              <div>
                <h4 className="font-medium">Name</h4>
                <p>{selectedCustomer.name}</p>
              </div>
              <div>
                <h4 className="font-medium">Email</h4>
                <p>{selectedCustomer.email}</p>
              </div>
              <div>
                <h4 className="font-medium">Phone</h4>
                <p>{selectedCustomer.phone}</p>
              </div>
              <div>
                <h4 className="font-medium">Address</h4>
                <p>{selectedCustomer.address}</p>
              </div>
              <div>
                <h4 className="font-medium">Branch</h4>
                <p>{selectedCustomer.branch?.name}</p>
                <p className="text-sm text-gray-500">{selectedCustomer.branch?.address}</p>
              </div>
              <div>
                <h4 className="font-medium">Outlet</h4>
                <p>{selectedCustomer.outlet?.name}</p>
                <p className="text-sm text-gray-500">{selectedCustomer.outlet?.location}</p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Customers;