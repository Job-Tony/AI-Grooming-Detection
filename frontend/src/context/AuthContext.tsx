import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import apiClient from "@/api/client";
import { TOKEN_KEY } from "@/constants/auth";
import authService from "@/services/authService";

import type {
  AuthState,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types/auth";

interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem(TOKEN_KEY),
    isAuthenticated: false,
    loading: true,
  });

  async function initializeAuth() {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
      return;
    }

    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;

    try {
      const user = await authService.getCurrentUser();

      setState({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      });
    } catch {
      localStorage.removeItem(TOKEN_KEY);

      delete apiClient.defaults.headers.common.Authorization;

      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  }

  useEffect(() => {
    void initializeAuth();
  }, []);

  async function login(data: LoginRequest) {
    const tokenResponse = await authService.login(data);

    localStorage.setItem(TOKEN_KEY, tokenResponse.access_token);

    apiClient.defaults.headers.common.Authorization =
      `Bearer ${tokenResponse.access_token}`;

    const user: User = await authService.getCurrentUser();

    setState({
      user,
      token: tokenResponse.access_token,
      isAuthenticated: true,
      loading: false,
    });
  }

  async function register(data: RegisterRequest) {
    await authService.register(data);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);

    delete apiClient.defaults.headers.common.Authorization;

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}