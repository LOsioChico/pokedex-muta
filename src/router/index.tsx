import { createBrowserRouter } from "react-router";

import { Home } from "../pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);
