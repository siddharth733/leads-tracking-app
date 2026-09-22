import { createBrowserRouter, Navigate } from "react-router";
import App from "../App";
import LeadsPage from "../pages/LeadsPage";
import CreateLeadPage from "../pages/CreateLeadPage";
import LeadDetailPage from "../pages/LeadDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
    ],
  },
]);
