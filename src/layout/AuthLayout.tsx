import { appRouteHelper } from "@/lib/route";
import userStore from "@/store/user.store";
import { Navigate, Outlet } from "react-router-dom";
const AuthLayout = () => {
  const { user } = userStore();
  console.log(user);
  // this ensure that the user can not access these selected routes if they already have been authenticiated
  if (user) return <Navigate to={appRouteHelper(user?.role)} />;
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
