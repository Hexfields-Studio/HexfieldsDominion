import { jwtDecode } from "jwt-decode";
import { type ReactNode } from "react";
import { useNavigate } from "react-router";
import { STORAGE_KEYS } from "@/constants/storage";
import { ACCESS_TOKEN_REFRESH_TIME_FRAME } from "@/constants/constants";
import { AuthContext, useFetchWithTimeout } from "./contexts";
import { useError } from "@/hooks/useError";

export type AuthContextType = {
    guest: () => Promise<Response | undefined>;
    register: (credentials: Credentials) => Promise<Response | undefined>;
    login: (credentials: Credentials) => Promise<Response | undefined>;
    logout: () => void;
    fetchWithAuth: (input: RequestInfo | URL, method: string, body?: BodyInit) => Promise<Response | undefined>;
    isAuthValid: () => Promise<boolean>;
}

type Credentials = {
    username: string;
    password: string;
}

export const AuthProvider = ({ children }: {children: ReactNode}) => {
  const navigate = useNavigate();
  const { isError } = useError();
  const { fetchWithTimeout } = useFetchWithTimeout();
  const API_URL = import.meta.env.VITE_API_URL;

  const guest = async () => {
    return doLoginRequest("/auth/guest");
  };

  const register = async (credentials: Credentials) => {
    return doLoginRequest("/auth/register", credentials);
  };

  const login = async (credentials: Credentials) => {
    return doLoginRequest("/auth/login", credentials);
  };

  const doLoginRequest = async (path: string, credentials?: Credentials) => {
    const response = await fetchWithTimeout(API_URL + path, {
      method: "POST",
      body: (credentials ? JSON.stringify(credentials) : null),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (isError(response)) {
      return response;
    }

    const responseJson = await response.json();
      
    const token = responseJson.accessToken;

    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);

    navigate("/play");
  };

  const logout = async () => {
    await fetchWithTimeout(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);

    navigate("/");
  };

  const fetchWithAuth = async (input: RequestInfo | URL, method: string, body?: BodyInit) => {
    const isValid = await isAuthValid();
    if (!isValid) {
      return;
    }

    return await fetchWithTimeout(API_URL + input, {
      method: method,
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json",
      },
      body: body ?? null,
    });
  };

  // ls necessary for immediate access (in e.g. fetchWithAuth for multiple calls in a row) without async set... of useState
  const getAccessToken = () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  const isAuthValid = async () => {
    const jwt = getAccessToken();
    if (jwt === null) {
      return false;
    }
    const jwtDecoded = jwtDecode(jwt);
    if (jwtDecoded.exp === undefined) {
      return false;
    }
    const expiresAt = new Date(jwtDecoded.exp * 1000);
        
    if ((expiresAt.getTime() - new Date().getTime()) < ACCESS_TOKEN_REFRESH_TIME_FRAME) {
      // request new token
      const refreshTokenResponse = await fetchWithTimeout(`${API_URL}/auth/refresh`, {
        method: "GET",
        credentials: "include",
      });
      if (refreshTokenResponse.status !== 200) {
        await logout();
        return false;
      }
      const responseJson = await refreshTokenResponse.json();
      const newToken = responseJson.accessToken;

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken);
    }

    return true;
  };

  return (
    <AuthContext.Provider value={{ guest, register, login, logout, fetchWithAuth, isAuthValid }}>
      {children}
    </AuthContext.Provider>
  );
};