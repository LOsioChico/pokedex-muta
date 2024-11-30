import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { usePokemonList } from "../hooks/usePokemonList";
import { useSearchPokemon } from "../hooks/useSearchPokemon";
import { PokemonCard, SearchBar, Pagination, ErrorState, LoadingSpinner } from "../components";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { pokemons, isLoading, totalPages, hasNextPage, hasPreviousPage, error } = usePokemonList(currentPage);
  const { filteredPokemons, isSearching } = useSearchPokemon({
    pokemons,
    searchTerm: debouncedSearchTerm,
  });

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  if (error) return <ErrorState message={error.message} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Pokédex</h1>

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      {filteredPokemons.length === 0 && debouncedSearchTerm && (
        <p className="text-center text-gray-500 my-8">
          No se encontraron Pokémon que coincidan con "{debouncedSearchTerm}"
        </p>
      )}

      {isLoading || isSearching ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPokemons.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}

      {!debouncedSearchTerm && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onNextPage={() => handlePageChange(currentPage + 1)}
          onPreviousPage={() => handlePageChange(currentPage - 1)}
        />
      )}
    </div>
  );
};

export default Home;
