import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { forgotPasswordSchema } from "@/validation/auth.validation";
import { axiosClient } from "@/axios";

interface ForgotPasswordFormValues {
  email: string;
}

const ForgetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      try {
        await axiosClient.post("/auth/forgot-password", values);
        toast({
          title: "Success",
          description: "If an account exists with this email, you will receive password reset instructions.",
        });
        navigate("/login");
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to process request. Please try again.",
        });
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Forgot Password</h2>
          <p className="text-muted-foreground mt-2">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-destructive">{formik.errors.email}</p>
            )}
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Sending..." : "Send Reset Instructions"}
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

export default ForgetPassword;