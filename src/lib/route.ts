import { activeTestingRoute } from "@/common/constants/auth";
import { Role } from "./types";

export const appRouteHelper = (role: Role): string => {
  console.log(role);

  return `/${role ?? activeTestingRoute}`;
};
