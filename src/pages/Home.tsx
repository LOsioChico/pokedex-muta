import { TYPE_COLORS, TYPE_TEXT_COLORS } from "../utils/pokemonTypeColors";
import { usePokemonList } from "../hooks/usePokemonList";
import { POKEMON_TYPE_TRANSLATIONS } from "../utils/pokemonTypeTranslations";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { useState, useMemo } from "react";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { pokemons, isLoading, totalPages, hasNextPage, hasPreviousPage, error } = usePokemonList(currentPage);

  const filteredPokemons = useMemo(() => {
    if (!debouncedSearchTerm) return pokemons;
    return pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
  }, [pokemons, debouncedSearchTerm]);

  const goToNextPage = () => {
    setSearchParams({ page: (currentPage + 1).toString() });
  };

  const goToPreviousPage = () => {
    setSearchParams({ page: (currentPage - 1).toString() });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading-spinner">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Ups! Algo salió mal</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
        </div>
        <Link to="/" className="text-gray-500 hover:text-gray-700 transition-colors bg-gray-200 px-4 py-2 rounded-lg">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Pokédex</h1>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Buscar Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md mx-auto block px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {filteredPokemons.length === 0 && debouncedSearchTerm && (
        <p className="text-center text-gray-500 my-8">
          No se encontraron Pokémon que coincidan con "{debouncedSearchTerm}"
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPokemons.map((pokemon) => (
          <Link
            key={pokemon.id}
            to={`/pokemon/${pokemon.id}`}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className={`aspect-square relative bg-gradient-to-br ${TYPE_COLORS[pokemon.types[0]]} bg-opacity-40`}>
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="absolute inset-0 w-full h-full object-contain p-4"
              />
            </div>
            <div className="p-4">
              <p className="text-gray-500 text-sm mb-1">#{pokemon.id.toString().padStart(3, "0")}</p>
              <h3 className="text-xl font-semibold capitalize mb-2">{pokemon.name}</h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.types.map((type) => (
                  <span
                    key={type}
                    className={`px-3 py-1 rounded-full capitalize text-sm font-medium ${TYPE_COLORS[type]} ${TYPE_TEXT_COLORS[type]}`}
                  >
                    {POKEMON_TYPE_TRANSLATIONS[type]}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!debouncedSearchTerm && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={goToPreviousPage}
            disabled={!hasPreviousPage}
            className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition-colors"
          >
            Anterior
          </button>
          <span className="px-4 py-2">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={!hasNextPage}
            className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
