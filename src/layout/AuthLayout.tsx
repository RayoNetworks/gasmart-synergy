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

  // this ensure that the user can not access these selected routes if they already have been authenticated
  if (user && localStorage.getItem(token)) {
    const redirectPath = appRouteHelper(user?.role);
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
};

export default AuthLayout;