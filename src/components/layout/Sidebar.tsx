import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  BarChart3,
  LogOut,
  Package,
  ShoppingCart,
  LineChart,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";
import logo from "../../assets/logo.png";

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const { logout } = useAuth();

  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/orders", icon: ShoppingCart, label: "Orders" },
    { to: "/products", icon: Package, label: "Products" },
    { to: "/performance", icon: LineChart, label: "Performance" },
    { to: "/users", icon: Users, label: "Users" },
    { to: "/sales", icon: ShoppingBag, label: "Sales Summary" },
    { to: "/trends", icon: BarChart3, label: "Sales Trends" },
  ];

  const handleLinkClick = () => {
    onClose?.();
  };

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-gray-200 bg-white",
        className
      )}
    >
      {/* LOGO */}
      <div className="flex h-20 items-center justify-center border-b border-gray-200 px-6">
        <img
          src={logo}
          alt="Daniyaal Perfumery"
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* NAV */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#e7b008]/10 text-[#e7b008]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-[#e7b008]" : "text-gray-400"
                    )}
                  />
                  {link.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* LOGOUT */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={() => {
            logout();
            handleLinkClick();
          }}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
