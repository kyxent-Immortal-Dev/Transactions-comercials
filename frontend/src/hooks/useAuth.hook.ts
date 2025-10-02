import { useAuthStore } from "../store/Auth.service";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const useAuth = () => {
  const { isLogged, user, token, login, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = useCallback(async (credentials: { email: string; password: string }) => {
    try {
      const success = await login(credentials);
      if (success) {
        navigate("/");
        return { success: true };
      } else {
        return { success: false, error: "Credenciales inválidas" };
      }
    } catch (error) {
      return { success: false, error: "Error del servidor" };
    }
  }, [login, navigate]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  const requireAuth = useCallback(() => {
    if (!isLogged && !token) {
      navigate("/login");
      return false;
    }
    return true;
  }, [isLogged, token, navigate]);

  return {
    // State
    isLogged,
    user,
    token,
    
    // Methods
    login: handleLogin,
    logout: handleLogout,
    requireAuth,
    
    // Computed
    isAuthenticated: isLogged || !!token,
  };
}; 