import { useFormik } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { setPasswordSchema } from "@/validation/auth.validation";
import { axiosClient } from "@/axios";

interface SetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

const SetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const formik = useFormik<SetPasswordFormValues>({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: setPasswordSchema,
    onSubmit: async (values) => {
      if (!token) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid or missing reset token.",
        });
        return;
      }

      try {
        await axiosClient.post("/auth/reset-password", {
          password: values.password,
          token,
        });
        
        toast({
          title: "Success",
          description: "Your password has been successfully reset.",
        });
        navigate("/login");
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response?.data?.message || "Failed to reset password. Please try again.",
        });
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Set New Password</h2>
          <p className="text-muted-foreground mt-2">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your new password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-destructive">{formik.errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              {...formik.getFieldProps("confirmPassword")}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-sm text-destructive">{formik.errors.confirmPassword}</p>
            )}
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Setting Password..." : "Set New Password"}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;