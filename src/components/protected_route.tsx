import { Navigate, Outlet } from "react-router";
import { useTestContext } from "../context/TestContext";

interface ProtectedRouteProps {
  redirectTo: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectTo }) => {
    const {isLoggedIn} = useTestContext();
    return isLoggedIn ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;

/*
Wrapper Component:
Use as Route element to redirect to a different route if condition is false. 
*/