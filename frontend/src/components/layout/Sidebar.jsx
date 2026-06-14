import { Link, useLocation } from "react-router-dom";
import { Home, Users, Receipt, TrendingUp, Upload } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/groups", icon: Users, label: "Groups" },
    { path: "/expenses", icon: Receipt, label: "Expenses" },
    { path: "/balance", icon: TrendingUp, label: "Balances" },
    { path: "/import", icon: Upload, label: "Import" },
  ];

  return (
    <div className="w-64 bg-gray-800 min-h-screen p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
