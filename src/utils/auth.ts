import { refresh_token as RefreshToken, token as Token } from "@/common/constants/auth";
import userStore from "@/store/user.store";

export const logout = () => {
  // Clear all auth-related items from localStorage
  localStorage.removeItem(Token);
  localStorage.removeItem(RefreshToken);
  
  // Clear the user state from zustand store
  const { setUser } = userStore();
  setUser(null);
  
  // Log the logout action
  console.log("Logged out successfully, clearing tokens and user state");
  
  // Force reload to ensure clean state
  window.location.href = "/login";
};