import { Link, NavLink, Outlet } from "react-router";
import { Layers, Plus, LayoutDashboard, LogOut } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthModal from "./components/common/AuthModal";

function AppContent() {
  const { isLocalStorageAuth, isEnvAuth, logout } = useAuth();

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <Link to="/leads" className="app-logo">
            <Layers className="logo-icon" size={22} strokeWidth={2.5} />
            <span className="app-logo-text">LeadsTracker</span>
          </Link>

          <nav className="app-nav">
            <NavLink
              to="/leads"
              end
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <LayoutDashboard size={16} strokeWidth={2} />
              <span className="nav-link-text">Leads Pipeline</span>
            </NavLink>

            <NavLink
              to="/leads/new"
              className="header-create-btn button button-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", fontSize: "14px" }}
            >
              <Plus size={16} strokeWidth={2.5} />
              <span className="header-create-text">Create Lead</span>
            </NavLink>

            {isLocalStorageAuth && !isEnvAuth && (
              <button
                type="button"
                onClick={logout}
                className="button button-ghost"
                title="Sign Out of Basic Auth"
                style={{ fontSize: "13px", padding: "6px 10px" }}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
