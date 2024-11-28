import { useEffect, useState } from "react";
import { getPokemonList } from "../api/pokeApi";
import { Pokemon } from "../interfaces/Pokemon";

export const usePokemonList = (currentPage: number = 1) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);

  const fetchPokemons = async (url?: string | null) => {
    setIsLoading(true);
    try {
      const { pokemons, totalPages, nextUrl, previousUrl } = await getPokemonList(url);
      setPokemons(pokemons);
      setTotalPages(totalPages);
      setNextUrl(nextUrl);
      setPreviousUrl(previousUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ha ocurrido un error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  const goToNextPage = () => {
    if (nextUrl) fetchPokemons(nextUrl);
  };

  const goToPreviousPage = () => {
    if (previousUrl) fetchPokemons(previousUrl);
  };

  return {
    pokemons,
    isLoading,
    error,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    hasNextPage: !!nextUrl,
    hasPreviousPage: !!previousUrl,
  };
};
