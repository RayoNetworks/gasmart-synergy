import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/axios";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Eye, Edit, Trash, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  status: string;
  createdAt: string;
}

const Branch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [highlightedBranchId, setHighlightedBranchId] = useState<string | null>(null);

  useEffect(() => {
    const viewBranchId = localStorage.getItem('viewBranchId');
    if (viewBranchId) {
      setHighlightedBranchId(viewBranchId);
      localStorage.removeItem('viewBranchId');
    }
  }, []);

  const { data: branches, isLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const response = await axiosClient.get("/branches");
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosClient.delete(`/branches/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast({
        title: "Success",
        description: "Branch deleted successfully",
      });
      setShowDeleteModal(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete branch",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (selectedBranch) {
      deleteMutation.mutate(selectedBranch.id);
    }
  };

  if (isLoading) {
    return //please show loading ui here;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Branches</h1>
        <Button onClick={() => navigate("/admin/branch/create")}>
          <Plus className="mr-2 h-4 w-4" /> Add Branch
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.map((branch: Branch) => (
            <TableRow 
              key={branch.id}
              className={`${
                highlightedBranchId === branch.id 
                  ? "bg-blue-50 transition-colors duration-500" 
                  : ""
              }`}
            >
              <TableCell>{branch.name}</TableCell>
              <TableCell>{branch.manager}</TableCell>
              <TableCell>{branch.phone}</TableCell>
              <TableCell>{branch.email}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    branch.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {branch.status}
                </span>
              </TableCell>
              <TableCell>{branch.createdAt}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedBranch(branch);
                        setShowViewModal(true);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate(`/admin/branch/${branch.id}/outlets`)}
                    >
                      <Store className="mr-2 h-4 w-4" />
                      View Outlets
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        navigate(`/admin/branch/${branch.id}/edit`)
                      }
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        setSelectedBranch(branch);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* View Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Branch Details</DialogTitle>
          </DialogHeader>
          {selectedBranch && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Name</h4>
                <p>{selectedBranch.name}</p>
              </div>
              <div>
                <h4 className="font-medium">Address</h4>
                <p>{selectedBranch.address}</p>
              </div>
              <div>
                <h4 className="font-medium">Manager</h4>
                <p>{selectedBranch.manager}</p>
              </div>
              <div>
                <h4 className="font-medium">Contact</h4>
                <p>{selectedBranch.phone}</p>
                <p>{selectedBranch.email}</p>
              </div>
              <div>
                <h4 className="font-medium">Status</h4>
                <p>{selectedBranch.status}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Branch</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this branch? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Branch;
