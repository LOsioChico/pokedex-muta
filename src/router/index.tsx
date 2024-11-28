import { createBrowserRouter } from "react-router";

import { Home } from "../pages";
import PokemonDetails from "../pages/PokemonDetails";

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
