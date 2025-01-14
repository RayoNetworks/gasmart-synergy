import { refresh_token as RefreshToken, token as Token } from "@/common/constants/auth";
import userStore from "@/store/user.store";

export const logout = () => {
  console.log("Starting logout process...");
  
  try {
    // Clear all auth-related items from localStorage
    localStorage.removeItem(Token);
    localStorage.removeItem(RefreshToken);
    
    // Clear the user state from zustand store
    const { setUser } = userStore.getState();
    setUser(null);
    
    console.log("Cleared tokens and user state");
    
    // Use window.location.replace for a clean redirect that won't be added to history
    window.location.replace("/login");
  } catch (error) {
    console.error("Error during logout:", error);
    // Ensure we still redirect even if there's an error
    window.location.replace("/login");
  }
};