import { axiosClient } from "@/axios";
import { Role } from "@/lib/types";
import { create } from "zustand";


type userData = {
  name: string;
  // the priviledge is broken down into string[] or string, if a string idt is * , if it's a string then the user has all priviledges
  priviledges: string[] | string;
  email: string;
  role: Role;
};
interface userStoreInference {
  user?: userData | null;
  // this function is to get the user info from the token in the localstorage
  getUserData: () => Promise<void>;
}

const userStore = create<userStoreInference>((set) => ({
  user: null,
  getUserData: async () => {
    const { data } = await axiosClient.get("/auth/logged-in");
    // this will get the logged in user and store their info in memory
    set((state) => ({
      user: data.user ?? {},
    }));
  },
}));

export default userStore;
