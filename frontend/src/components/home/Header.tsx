import { useAuthStore } from "../../store/Auth.service";
import { LogOut, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarComponent } from "./SidebarComponent";

export const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Sidebar and Logo */}
          <div className="flex items-center space-x-4">
            {/* Sidebar Component */}
            <SidebarComponent />
            
            {/* Logo/Brand */}
            <h1 className="text-xl font-bold text-gray-900">
              Inventario
            </h1>
          </div>

          {/* Right side - User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || user?.email || "Usuario"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role || "Usuario"}
                </p>
              </div>
            </div>

            {/* Settings Button */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
              <Settings className="h-5 w-5" />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:block">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
