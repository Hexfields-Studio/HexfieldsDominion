import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";

type User = {
    email: string;
}

type AuthContextType = {
    user: User | null;
    token: string | null;
    register: (email: string, password: string) => void;
    login: (email: string, password: string) => void;
    logout: () => void;
}

type JwtDecoded = {
    user: User;
    token: string;
    expiresAt: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            return;
        }

        setToken(storedToken);
        const decodedToken: JwtDecoded = jwtDecode(storedToken);
        setUser(decodedToken.user);
    }, []);

    const register = async (email: string, password: string) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            body: JSON.stringify({email, password}),
            headers: { 'Content-Type': 'application/json' }
        });
        const responseJson = await response.json();
      
        const token = responseJson.token;

        localStorage.setItem("token", token);
        setToken(token);
        const decodedToken: JwtDecoded = jwtDecode(token);
        setUser(decodedToken.user);
        
        navigate("/play");
    }

    const login = async (email: string, password: string) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify({email, password}),
            headers: { 'Content-Type': 'application/json' }
        });
        const responseJson = await response.json();
      
        const token = responseJson.token;

        localStorage.setItem("token", token);
        setToken(token);
        const decodedToken: JwtDecoded = jwtDecode(token);
        setUser(decodedToken.user);
        
        navigate("/play");
    };

    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);

        navigate("/");
    };

    return (
        <AuthContext.Provider value={{user, token, register, login, logout}}>
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