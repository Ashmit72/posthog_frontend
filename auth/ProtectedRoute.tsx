// import  useIsAuthenticated  from 'react-auth-kit';
import { Navigate, Outlet } from 'react-router-dom';
import isAuthenticated from './isAuthenticated';

interface ProtectedRouteProps {
    children?: React.ReactNode;
  }

const ProtectedRoute = ({children}:ProtectedRouteProps) => {
  if (!isAuthenticated()) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child routes
  return <>{children ||<Outlet />}</>;
};

export default ProtectedRoute;
