import { appRouteHelper } from "@/lib/route";
import userStore, { userData } from "@/store/user.store";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { token } from "@/common/constants/auth";
import { Role } from "@/lib/types";

//dummy get user
const getDummyUser = (role: Role): userData => ({
  name: "Test User",
  email: "test@gmail.com",
  priviledges: "*",
  role: role,
});

const ConfirmRole = () => {
  const { getUserData, user, setUser } = userStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [isError, setIsErrorMessage] = useState<{
    message: string;
  }>({
    message: "",
  });

  const fetchUserData = async () => {
    try {
      // this is to allow the ui to render for more than 2 sec
      const timer = setTimeout(async () => {
        // add a guard to check if the token exist, if not navigate to the login page
        if (!localStorage.getItem(token)) {
          navigate("/login");
          return;
        }

        // fetch user data
        // await getUserData();

        const userPerson = getDummyUser("cashier");

        setUser(userPerson);

        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    } catch (error) {
      setIsErrorMessage({
        message: "Failed to confirm your role. Please try again later.",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [getUserData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-secondary to-background p-4">
        <div className="w-full max-w-md p-8 rounded-lg bg-white/80 backdrop-blur-sm shadow-xl border border-primary/20">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <h2 className="text-xl font-semibold text-foreground">
              Confirming Your Role
            </h2>
            <p className="text-muted-foreground text-center">
              Please wait while we verify your access privileges...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError.message) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-secondary to-background p-4">
        <div className="w-full max-w-md">
          <Alert
            variant="destructive"
            className="bg-white/80 backdrop-blur-sm border-destructive/50"
          >
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{isError.message}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return <Navigate to={appRouteHelper(user?.role)} />;
};

export default ConfirmRole;
