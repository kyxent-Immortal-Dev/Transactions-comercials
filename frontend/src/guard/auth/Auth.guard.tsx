import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/Auth.service";
import { LoadingSpinner } from "../../components/LoadingSpinner";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isLogged, token } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Simulate a small delay to show loading state
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);

    // Check if user is authenticated
    if (!isLogged && !token) {
      // Save the attempted URL to redirect after login
      navigate("/login", { 
        replace: true,
        state: { from: location.pathname }
      });
    }

    return () => clearTimeout(timer);
  }, [isLogged, token, navigate, location]);

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Verificando autenticación..." />
      </div>
    );
  }

  // Show loading or nothing while checking auth
  if (!isLogged && !token) {
    return null;
  }

  return <>{children}</>;
}; 