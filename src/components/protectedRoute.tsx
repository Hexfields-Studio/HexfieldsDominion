import { Await, Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import React, { useEffect, useState } from "react";

interface ProtectedRouteProps {
  redirectTo: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectTo }) => {
  const {isAuthValid} = useAuth();

  const [authValidLoader, setAuthValidLoader] = useState<Promise<boolean> | undefined>(undefined);

  useEffect(() => {
    setAuthValidLoader(new Promise(resolve => resolve(isAuthValid())))
  }, [])

  return authValidLoader && (
    <React.Suspense>
      <Await resolve={authValidLoader}>
        {valid => (valid ? <Outlet/> : <Navigate to={redirectTo} replace />)}
      </Await>
    </React.Suspense>
  );
};

export default ProtectedRoute;

/*
Wrapper Component:
Use as Route element to redirect to a different route if condition is false. 
*/