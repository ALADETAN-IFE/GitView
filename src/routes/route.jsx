import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import UserPage from "../pages/UserPage";
import RepoPage from "../pages/RepoPage";
import Layout from "../layout/layout";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout   />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/user/:username",
        element: <UserPage />,
      },
      {
        path: "/repo/:owner/:repo",
        element: <RepoPage />,
      },
    ]
  },
]);
