import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export default function ProtectedRoute({ children, role }: any) {
  const { isSignedIn, isLoaded, user } = useUser();
  const location = useLocation();

  if (!isLoaded) return null;

  // ❌ Não logado → manda pro login
  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 👇 pega role do usuário
  const userRole = user?.publicMetadata?.role;

  // ❌ Se a rota exige role e não bate
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  // ✅ autorizado
  return children;
}