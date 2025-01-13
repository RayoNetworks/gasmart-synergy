import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { loginSchema } from "@/validation/auth.validation";
import { axiosClient } from "@/axios";
import {
  token as Token,
  refresh_token as RefreshToken,
} from "@/common/constants/auth";
import { userData } from "@/store/user.store";
import { Role } from "@/lib/types";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        console.log("Login - Submitting form with values:", values);

        // Extract role from email
        const role = values.email.split('@')[0];
        console.log("Extracted role:", role);

        // Mock login response
        const mockResponse = {
          token: "mock-token-12345",
          refresh_token: "mock-refresh-token-12345",
          user: {
            name: "Test User",
            email: values.email,
            priviledges: "*",
            role: role as Role
          }
        };

        // Store tokens in localStorage
        localStorage.setItem(Token, mockResponse.token);
        localStorage.setItem(RefreshToken, mockResponse.refresh_token);

        toast({
          title: "Success",
          description: "Login successful!",
        });

        // Navigate to confirm-role page with role parameter
        navigate(`/confirm-role?role=${role}`, { replace: true });
      } catch (error: any) {
        console.error("Login - Error during login:", error);

        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.response?.data?.message || "Login failed. Please try again.",
        });
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-muted-foreground mt-2">
            Please sign in to continue
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

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-destructive">
                {formik.errors.password}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="link"
              onClick={() => navigate("/forgot-password")}
              className="px-0"
            >
              Forgot password?
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;