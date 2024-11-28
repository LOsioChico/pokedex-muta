import { useEffect, useState } from "react";
import { getPokemonList } from "../api/pokeApi";
import { Pokemon } from "../interfaces/Pokemon";

export const usePokemonList = (currentPage: number = 1) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);

  const fetchPokemons = async (currentPage: number) => {
    setIsLoading(true);
    try {
      const { pokemons, totalPages, nextUrl, previousUrl } = await getPokemonList(currentPage);
      setPokemons(pokemons);
      setTotalPages(totalPages);
      setNextUrl(nextUrl);
      setPreviousUrl(previousUrl);
    } catch (err) {
      if (err instanceof Error) setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons(currentPage);
  }, [currentPage]);

  return {
    pokemons,
    isLoading,
    error,
    totalPages,
    hasNextPage: !!nextUrl,
    hasPreviousPage: !!previousUrl,
  };
};
