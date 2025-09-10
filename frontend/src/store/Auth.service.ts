import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AccountService } from "../services/api/Account.service";
import { HttpClient } from "../services/http.client.service";
import type { LoginCredentials, User, AuthState } from "../interfaces/Auth.interfaces";

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isLogged: false,
      user: null,
      token: null,

      login: async (credentials: LoginCredentials) => {
        try {
          const service = new AccountService(HttpClient);
          const response = await service.login(credentials);

          if (response.msj === "login sucessfully") {
            const token = response.data;
            
            // Decode JWT to get user info (basic implementation)
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              const user: User = {
                id: payload.id,
                email: payload.email,
                name: payload.name || payload.email,
                role: payload.role
              };

              set({
                isLogged: true,
                user,
                token
              });

              // Store in localStorage
              localStorage.setItem("token", token);
              localStorage.setItem("user", JSON.stringify(user));

              return true;
            } catch (error) {
              console.error("Error decoding JWT:", error);
              return false;
            }
          }
          return false;
        } catch (error) {
          console.error("Login error:", error);
          return false;
        }
      },

      logout: () => {
        const service = new AccountService(HttpClient);
        service.logout();
        
        set({
          isLogged: false,
          user: null,
          token: null
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      setToken: (token: string) => {
        set({ token });
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        isLogged: state.isLogged, 
        user: state.user, 
        token: state.token 
      })
    }
  )
);
