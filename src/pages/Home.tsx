import { TYPE_COLORS, TYPE_TEXT_COLORS } from "../utils/pokemonTypeColors";
import { usePokemonList } from "../hooks/usePokemonList";
import { POKEMON_TYPE_TRANSLATIONS } from "../utils/pokemonTypeTranslations";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const { pokemons, isLoading, totalPages, hasNextPage, hasPreviousPage } = usePokemonList(currentPage);

  const goToNextPage = () => {
    setSearchParams({ page: (currentPage + 1).toString() });
  };

  const goToPreviousPage = () => {
    setSearchParams({ page: (currentPage - 1).toString() });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Pokédex</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pokemons.map((pokemon) => (
          <div
            key={pokemon.id}
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
          </div>
        ))}
      </div>

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
    </div>
  );
};

export default Home;