import { refresh_token as RefreshToken, token as Token } from "@/common/constants/auth";

export const logout = () => {
  // Clear all auth-related items from localStorage
  localStorage.removeItem(Token);
  localStorage.removeItem(RefreshToken);
  
  // Clear any other auth-related items if needed
  console.log("Logged out successfully");
};