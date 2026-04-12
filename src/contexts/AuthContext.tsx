import { jwtDecode } from "jwt-decode";
import { createContext, useContext, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { STORAGE_KEYS } from "../constants/storage";
import { ACCESS_TOKEN_REFRESH_TIME_FRAME } from "../constants/constants";

type AuthContextType = {
    guest: () => void;
    register: (credentials: Credentials) => void;
    login: (credentials: Credentials) => void;
    logout: () => void;
    fetchWithAuth: (input: RequestInfo | URL, method: string) => Promise<Response | undefined>;
    isAuthValid: () => Promise<boolean>;
}

type Credentials = {
    email: string;
    password: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const guest = async () => {
        await doLoginRequest("/auth/guest");
    };

    const register = async (credentials: Credentials) => {
        await doLoginRequest("/auth/register", credentials);
    }

    const login = async (credentials: Credentials) => {
        await doLoginRequest("/auth/login", credentials);
    };

    const doLoginRequest = async (path: string, credentials?: Credentials) => {
        const response = await fetch(API_URL + path, {
            method: "POST",
            body: (credentials ? JSON.stringify(credentials) : null),
            headers: { 'Content-Type': 'application/json' }
        });
        const responseJson = await response.json();
      
        const token = responseJson.accessToken;

        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);

        navigate("/play");
    }

    const logout = async () => {
        await fetch(`${API_URL}/auth/logout`, {method: "POST"});

        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);

        navigate("/");
    };

    const fetchWithAuth = async (input: RequestInfo | URL, method: string) => {
        const isValid = await isAuthValid();
        if (!isValid) {
            return;
        }

        return await fetch(API_URL + input, {
            method: method,
            headers: {
                "Authorization": `Bearer ${getAccessToken()}`,
                "Content-Type": "application/json"
            }
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
            const refreshTokenResponse = await fetch(`${API_URL}/auth/refresh`);
            if (refreshTokenResponse.status !== 200) {
                await logout();
                return false;
            }
            const responseJson = await refreshTokenResponse.json();
            const newToken = responseJson.accessToken;

            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken);
        }

        return true;
    }

    return (
        <AuthContext.Provider value={{guest, register, login, logout, fetchWithAuth, isAuthValid}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
};