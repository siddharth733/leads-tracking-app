import { createBrowserRouter, Navigate } from "react-router";
import App from "../App";
import LeadsPage from "../pages/LeadsPage";
import CreateLeadPage from "../pages/CreateLeadPage";
import LeadDetailPage from "../pages/LeadDetailPage";
import NotFoundPage from "../pages/NotFoundPage";
import RouteErrorPage from "../pages/RouteErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/leads" replace />,
      },
      {
        path: "leads",
        element: <LeadsPage />,
      },
      {
        path: "leads/new",
        element: <CreateLeadPage />,
      },
      {
        path: "leads/:id",
        element: <LeadDetailPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
