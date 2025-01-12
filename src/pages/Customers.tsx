import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Edit, Eye, Package, Trash } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

// Mock data
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+234 123 4567",
    address: "123 Main St, Lagos",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+234 987 6543",
    address: "456 Oak Ave, Abuja",
  },
  {
    id: "3",
    name: "Timothy Avell",
    email: "tim@example.com",
    phone: "+234 555 1234",
    address: "789 Pine Rd, Port Harcourt",
  },
];

const Customers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);

  const handleDelete = async (customerId: string) => {
    // Mock delete functionality
    console.log("Deleting customer:", customerId);
    toast({
      title: "Success",
      description: "Customer deleted successfully",
    });
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setIsViewSheetOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/admin/crm/customers/${customer.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/admin/crm/customers/${customer.id}/products`)}
                    >
                      <Package className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
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
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCustomer?.name} from the system?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedCustomer && handleDelete(selectedCustomer.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Customers;