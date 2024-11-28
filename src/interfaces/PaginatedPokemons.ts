import { Pokemon } from "./Pokemon";

export interface PaginatedPokemons {
  pokemons: Pokemon[];
  totalPages: number;
  nextUrl: string | null;
  previousUrl: string | null;
}
