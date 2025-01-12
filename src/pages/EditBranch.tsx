import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/axios";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";

interface BranchFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  status: string;
}

const EditBranch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, reset } = useForm<BranchFormData>();

  // Fetch branch details
  const { data: branch, isLoading } = useQuery({
    queryKey: ["branch", id],
    queryFn: async () => {
      const response = await axiosClient.get(`/branches/${id}`);
      return response.data;
    },
  });

  // Update form when branch data is loaded
  useEffect(() => {
    if (branch) {
      reset(branch);
    }
  }, [branch, reset]);

  // Update branch mutation
  const updateMutation = useMutation({
    mutationFn: (data: BranchFormData) =>
      axiosClient.put(`/branches/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast({
        title: "Success",
        description: "Branch updated successfully",
      });
      navigate("/admin/branch");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update branch",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BranchFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/branch")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Branch</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Branch Name</Label>
            <Input id="name" {...register("name")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="manager">Manager</Label>
            <Input id="manager" {...register("manager")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) => setValue("status", value)}
              defaultValue={branch?.status}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/branch")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditBranch;