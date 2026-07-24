import apiClient from "@/api/client";
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
} from "@/types/auth";

class AuthService {
  async register(data: RegisterRequest): Promise<User> {
    const response = await apiClient.post<User>("/auth/register", data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>("/auth/login", data);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  }
}

export default new AuthService();