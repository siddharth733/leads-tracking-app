import { isRouteErrorResponse, Link, useRouteError } from "react-router";

export default function RouteErrorPage() {
  const error = useRouteError();

  let message = "Something went wrong.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      message = "The page you're looking for doesn't exist.";
    } else if (error.status === 500) {
      message = "The server encountered an error.";
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <section className="state state-error">
      <h1>Something went wrong</h1>

      <p>{message}</p>

      <Link to="/leads" className="button button-primary">
        Back to Leads
      </Link>
    </section>
  );
}
