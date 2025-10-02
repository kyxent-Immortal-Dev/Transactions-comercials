import { Menu, Home, FolderOpen, Layers, Package, Calculator, Users, UserCheck, Truck, Scale, FileText, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useRef } from "react";

const menuItems = [
  { to: "/", label: "Dashboard", icon: Home, section: "main" },
  { to: "/categories", label: "Categorías", icon: FolderOpen, section: "inventory" },
  { to: "/subcategories", label: "Subcategorías", icon: Layers, section: "inventory" },
  { to: "/products", label: "Productos", icon: Package, section: "inventory" },
  { to: "/vendors", label: "Vendedores", icon: Users, section: "contacts" },
  { to: "/clients", label: "Clientes", icon: UserCheck, section: "contacts" },
  { to: "/suppliers", label: "Proveedores", icon: Truck, section: "purchasing" },
  { to: "/supplier-contacts", label: "Contactos Proveedores", icon: Users, section: "purchasing" },
  { to: "/units", label: "Unidades", icon: Scale, section: "purchasing" },
  { to: "/quotes", label: "Cotizaciones", icon: FileText, section: "purchasing" },
  { to: "/buy-orders", label: "Órdenes de Compra", icon: ShoppingCart, section: "purchasing" },
  { to: "/calculate", label: "Calculadora", icon: Calculator, section: "tools" },
];

export const SidebarComponent = () => {
  const drawerRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  const closeDrawer = () => {
    if (drawerRef.current) {
      drawerRef.current.checked = false;
    }
  };

  const isActiveRoute = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="drawer">
      {/* Control del drawer */}
      <input id="my-drawer" ref={drawerRef} type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content">
        {/* Botón abrir - más pequeño y elegante */}
        <label
          htmlFor="my-drawer"
          className="btn btn-ghost btn-sm drawer-button p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </label>
      </div>

      <div className="drawer-side z-50">
        {/* Overlay para cerrar */}
        <label htmlFor="my-drawer" className="drawer-overlay"></label>

        {/* Sidebar content */}
        <div className="bg-white border-r border-gray-200 min-h-full w-80 p-6 pt-20 shadow-xl">
          {/* Header del sidebar */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Navegación</h2>
            <p className="text-sm text-gray-500 mt-1">Accede a todas las funciones</p>
          </div>

          {/* Menu items */}
          <nav className="space-y-6">
            {/* Main Section */}
            <div>
              {menuItems.filter(item => item.section === "main").map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.to);
                
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeDrawer}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${
                      isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                    }`} />
                    <span className={`font-medium ${
                      isActive ? "text-blue-700" : "text-gray-700 group-hover:text-gray-900"
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Inventory Section */}
            <div>
              <h3 className="px-4 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Inventario
              </h3>
              <div className="space-y-1">
                {menuItems.filter(item => item.section === "inventory").map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.to);
                  
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={closeDrawer}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${
                        isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                      }`} />
                      <span className={`font-medium ${
                        isActive ? "text-blue-700" : "text-gray-700 group-hover:text-gray-900"
                      }`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Contacts Section */}
            <div>
              <h3 className="px-4 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Contactos
              </h3>
              <div className="space-y-1">
                {menuItems.filter(item => item.section === "contacts").map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.to);
                  
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={closeDrawer}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${
                        isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                      }`} />
                      <span className={`font-medium ${
                        isActive ? "text-blue-700" : "text-gray-700 group-hover:text-gray-900"
                      }`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Purchasing Section */}
            <div>
              <h3 className="px-4 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Sistema de Compras
              </h3>
              <div className="space-y-1">
                {menuItems.filter(item => item.section === "purchasing").map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.to);
                  
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={closeDrawer}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${
                        isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                      }`} />
                      <span className={`font-medium ${
                        isActive ? "text-blue-700" : "text-gray-700 group-hover:text-gray-900"
                      }`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Tools Section */}
            <div>
              <h3 className="px-4 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Herramientas
              </h3>
              <div className="space-y-1">
                {menuItems.filter(item => item.section === "tools").map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.to);
                  
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={closeDrawer}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${
                        isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                      }`} />
                      <span className={`font-medium ${
                        isActive ? "text-blue-700" : "text-gray-700 group-hover:text-gray-900"
                      }`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Footer del sidebar */}
          <div className="absolute bottom-6 left-6 right-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Versión 1.0.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
