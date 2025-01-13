import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosClient } from "@/axios";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface OutletFormData {
  name: string;
  location: string;
  branchId: string;
  managerId: string;
  phone: string;
  email: string;
}

const CreateOutlet = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  const preSelectedBranchId = searchParams.get('branchId');

  const form = useForm<OutletFormData>({
    defaultValues: {
      name: "",
      location: "",
      branchId: preSelectedBranchId || "",
      managerId: "",
      phone: "",
      email: "",
    },
  });

  // Fetch branches for the select input
  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const response = await axiosClient.get("/branches");
      return response.data;
    },
  });

  // Fetch available managers (those who don't have an assigned outlet)
  const { data: availableManagers } = useQuery({
    queryKey: ["managers"],
    queryFn: async () => {
      const response = await axiosClient.get("/managers", {
        params: { managerType: "outlet_manager", hasManager: false }
      });
      console.log("Available managers:", response.data);
      return response.data;
    },
  });

  // Fetch outlet data if editing
  const { data: outletData } = useQuery({
    queryKey: ["outlet", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await axiosClient.get(`/outlets/${id}`);
      return response.data;
    },
    enabled: isEditing,
  });

  // Set form values when editing
  useEffect(() => {
    if (outletData) {
      form.reset(outletData);
    }
  }, [outletData, form]);

  const mutation = useMutation({
    mutationFn: async (data: OutletFormData) => {
      if (isEditing) {
        return axiosClient.put(`/outlets/${id}`, data);
      }
      return axiosClient.post("/outlets", data);
    },
    onSuccess: () => {
      toast({
        title: `Outlet ${isEditing ? "updated" : "created"} successfully`,
      });
      if (preSelectedBranchId) {
        navigate(`/admin/branch/${preSelectedBranchId}/outlets`);
      } else {
        navigate("/admin/outlets");
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} outlet`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: OutletFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Outlet" : "Create New Outlet"}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outlet Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!!preSelectedBranchId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches?.map((branch: any) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="managerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manager</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a manager" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableManagers?.map((manager: any) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => 
                preSelectedBranchId 
                  ? navigate(`/admin/branch/${preSelectedBranchId}/outlets`)
                  : navigate("/admin/outlets")
              }
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update Outlet" : "Create Outlet"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateOutlet;