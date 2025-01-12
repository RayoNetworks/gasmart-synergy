import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { customerSchema } from "@/validation/customer.validation";
import { axiosClient } from "@/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface CustomerFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: customer, isLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      const response = await axiosClient.get(`/customers/${id}`);
      return response.data;
    },
  });

  const formik = useFormik<CustomerFormValues>({
    initialValues: {
      name: customer?.name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      address: customer?.address || "",
    },
    enableReinitialize: true,
    validationSchema: customerSchema,
    onSubmit: async (values) => {
      try {
        await axiosClient.put(`/customers/${id}`, values);
        toast({
          title: "Success",
          description: "Customer updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        navigate("/admin/crm/customers");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update customer",
        });
      }
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Customer</h1>
        
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-sm text-destructive">{formik.errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-destructive">{formik.errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...formik.getFieldProps("phone")}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-sm text-destructive">{formik.errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...formik.getFieldProps("address")}
            />
            {formik.touched.address && formik.errors.address && (
              <p className="text-sm text-destructive">{formik.errors.address}</p>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Updating..." : "Update Customer"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/crm/customers")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;