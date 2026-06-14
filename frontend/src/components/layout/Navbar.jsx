import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Wallet, LayoutDashboard, Scale, Upload, Menu, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const navLinks = user
    ? [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/balance",   icon: Scale,           label: "Balances"  },
        { to: "/import",    icon: Upload,           label: "Import"    },
      ]
    : [];

  const isActive = (path) => location.pathname === path;

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md group-hover:shadow-indigo-200 transition-all duration-300">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight">
              Split<span className="text-indigo-500">Wise</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive(to)
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:block">{label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          {user && (
            <div className="flex items-center gap-2">
              {/* User pill - desktop only */}
              <div className="hidden sm:flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-100">
                <div
                  className="avatar w-7 h-7 text-xs"
                  style={{ background: "linear-gradient(135deg, hsl(225 72% 55%), hsl(258 72% 60%))" }}
                >
                  {initials}
                </div>
                <span className="text-sm font-semibold text-slate-700 hidden lg:block max-w-[120px] truncate">
                  {user.name}
                </span>
              </div>

              {/* Logout - desktop */}
              <button
                onClick={handleLogout}
                title="Logout"
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(true)}
                className="flex md:hidden items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu-backdrop" />
          <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
            {/* Drawer header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <span className="font-extrabold text-slate-800 text-base">
                  Split<span className="text-indigo-500">Wise</span>
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User info */}
            {user && (
              <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-2xl mb-4 border border-indigo-100">
                <div
                  className="avatar w-10 h-10 text-sm"
                  style={{ background: "linear-gradient(135deg, hsl(225 72% 55%), hsl(258 72% 60%))" }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 font-medium truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Nav links */}
            <div className="flex flex-col gap-1 flex-1">
              {navLinks.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive(to)
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all mt-2 w-full"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
