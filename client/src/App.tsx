import { Link, Outlet } from "react-router";

export default function App() {
  return (
    <>
      <header>
        <nav>
          <Link to="/leads">Leads</Link>
          {" | "}
          <Link to="/leads/new">Create Lead</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
