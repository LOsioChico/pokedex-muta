import { useState, useMemo, useCallback, useEffect } from "react";
import { Pokemon } from "../interfaces/Pokemon";
import { getPokemon } from "../api/pokeApi";

interface UseSearchPokemonProps {
  pokemons: Pokemon[];
  searchTerm: string;
}

interface UseSearchPokemonReturn {
  filteredPokemons: Pokemon[];
  isSearching: boolean;
}

export const useSearchPokemon = ({ pokemons, searchTerm }: UseSearchPokemonProps): UseSearchPokemonReturn => {
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const filteredPokemons = useMemo(() => {
    if (!searchTerm) return pokemons;

    const normalizedSearchTerm = searchTerm.toLowerCase();
    const localFiltered = pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(normalizedSearchTerm));

    return localFiltered.length > 0 ? localFiltered : searchResults;
  }, [pokemons, searchTerm, searchResults]);

  const searchPokemon = useCallback(async () => {
    if (!searchTerm) return;
    setIsSearching(true);
    try {
      const result = await getPokemon(searchTerm);
      setSearchResults(result ? [result] : []);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const normalizedSearchTerm = searchTerm.toLowerCase();
    const hasLocalMatches = pokemons.some((pokemon) => pokemon.name.toLowerCase().includes(normalizedSearchTerm));

    if (searchTerm && !hasLocalMatches) searchPokemon();
    else setSearchResults([]);
  }, [searchTerm, pokemons, searchPokemon]);

  return { filteredPokemons, isSearching };
};
