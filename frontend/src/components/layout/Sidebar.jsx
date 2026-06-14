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
    <div style={{ width: '16rem', background: '#1e293b', minHeight: '100vh', padding: '1rem' }}>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 rounded-xl"
              style={{
                padding: '0.75rem 1rem',
                transition: 'all 0.2s',
                fontSize: '0.875rem',
                fontWeight: 600,
                background: isActive ? '#6366f1' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
              }}
            >
              <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
