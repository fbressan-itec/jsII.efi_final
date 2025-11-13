import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  //mensaje de carga
  if (loading) {
    return (
      <div>
        Cargando...
      </div>
    );
  }
  // Rediccion si falla el auth
  return user ? children : <Navigate to="/logearse" replace />;
}