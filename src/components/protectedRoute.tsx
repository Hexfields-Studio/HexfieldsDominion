import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  redirectTo: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectTo }) => {
  let {token} = useAuth();
  
  if (!token) {
    token = localStorage.getItem("token");
  }

  return token ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;

/*
Wrapper Component:
Use as Route element to redirect to a different route if condition is false. 
*/