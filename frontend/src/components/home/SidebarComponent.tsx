import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";

const menuItems = [
  { to: "/", label: "Dashboard" },
  { to: "/categories", label: "Categories" },
  { to: "/subcategories", label: "Subcategories" },
  { to: "/products", label: "Products" },
];

export const SidebarComponent = () => {
  const drawerRef = useRef<HTMLInputElement>(null);

  const closeDrawer = () => {
    if (drawerRef.current) {
      drawerRef.current.checked = false; // cierra el sidebar
    }
  };

  return (
    <div className="drawer">
      {/* control del drawer */}
      <input id="my-drawer" ref={drawerRef} type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content">
        {/* Botón abrir */}
        <label
          htmlFor="my-drawer"
          className="btn drawer-button"
          aria-label="Open sidebar"
        >
          <Menu />
        </label>
      </div>

      <div className="drawer-side">
        {/* overlay para cerrar */}
        <label htmlFor="my-drawer" className="drawer-overlay"></label>

        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 pt-20 space-y-2">
          {menuItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={closeDrawer} // 🚀 cerrar al hacer clic
                className="btn w-full justify-start" // 🚀 estilo botón
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
