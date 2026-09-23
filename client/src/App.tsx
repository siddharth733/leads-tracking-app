import { Link, NavLink, Outlet } from "react-router";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <Link to="/leads" className="app-logo">
            Leads Tracker
          </Link>

          <nav className="app-nav">
            <NavLink
              to="/leads"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Leads
            </NavLink>

            <NavLink
              to="/leads/new"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Create Lead
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
