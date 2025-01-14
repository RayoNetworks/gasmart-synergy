import { appRouteHelper } from "@/lib/route";
import userStore from "@/store/user.store";
import { Navigate, Outlet } from "react-router-dom";
import { token } from "@/common/constants/auth";

const AuthLayout = () => {
  const { user } = userStore();
  
  // Add console logs to help debug the authentication flow
  console.log("AuthLayout - Current user:", user);
  console.log("AuthLayout - Token exists:", !!localStorage.getItem(token));
  console.log("AuthLayout - Redirecting to:", user ? appRouteHelper(user?.role) : null);

  // Check if user is authenticated and has valid token
  if (user && localStorage.getItem(token)) {
    const redirectPath = appRouteHelper(user?.role);
    console.log("User authenticated, redirecting to:", redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // If no user or token, allow access to auth routes (login, etc.)
  console.log("No authenticated user, showing auth layout");
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
};

export default AuthLayout;