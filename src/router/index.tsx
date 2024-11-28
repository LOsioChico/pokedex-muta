import { createBrowserRouter } from "react-router";

import { Home, PokemonDetails } from "../pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/pokemon/:id",
    element: <PokemonDetails />,
  },
]);
