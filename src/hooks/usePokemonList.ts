import { useEffect, useState } from "react";
import { getPokemonList } from "../api/pokeApi";
import { Pokemon } from "../interfaces/Pokemon";

export const usePokemonList = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPokemonList()
      .then(setPokemons)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);

  return { pokemons, isLoading, error };
};
