import { appRouteHelper } from "@/lib/route";
import userStore from "@/store/user.store";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ConfirmRole = () => {
  const { getUserData, user } = userStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsErrorMessage] = useState<{
    message: string;
  }>({
    message: "",
  });
  useEffect(() => {
    (async () => {
      await getUserData();
    })();
  }, []);

  if (isLoading) return <>{/* create a spinner */}</>;
  if (isError) return <>{/** create an error ui*/}</>;
  return <Navigate to={appRouteHelper(user?.role)} />;
};

export default ConfirmRole;
