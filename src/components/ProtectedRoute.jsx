import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null; 

  if (!isSignedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};
