import { Navigate, Outlet } from "react-router";
import { getStorageItem, STORAGE_KEYS } from "../constants/storage";

interface ProtectedRouteProps {
  redirectTo: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectTo }) => {
    const isLoggedIn = getStorageItem(STORAGE_KEYS.IS_LOGGED_IN, false);
    return isLoggedIn ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;

/*
Wrapper Component:
Use as Route element to redirect to a different route if condition is false. 
*/