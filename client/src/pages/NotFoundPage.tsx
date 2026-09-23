import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <section className="state">
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist.</p>

      <Link to="/leads" className="button button-primary">
        Back to Leads
      </Link>
    </section>
  );
}
