import { useEffect, useState } from "react";
import { type Pokemon } from "../interfaces/Pokemon";
import { getPokemon } from "../api/pokeApi";

export const usePokemon = (id: string) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPokemon(id)
      .then(setPokemon)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [id]);

  return { pokemon, isLoading, error };
};
