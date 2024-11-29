import { useParams } from "react-router-dom";
import { usePokemon } from "../hooks/usePokemon";
import { TYPE_COLORS, TYPE_TEXT_COLORS } from "../utils/pokemonTypeColors";
import { POKEMON_TYPE_TRANSLATIONS } from "../utils/pokemonTypeTranslations";
import { Link } from "react-router-dom";

const PokemonDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { pokemon, isLoading, error } = usePokemon(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          data-testid="loading-spinner"
          className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
        />
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-red-500">{error?.message}</p>
        <Link to="/" className="bg-gray-100 px-3 py-1 rounded-full">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="mb-8 inline-block bg-gray-100 px-3 py-1 rounded-full">
        ← Volver al listado
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto">
        <div className={`aspect-video relative bg-gradient-to-br ${TYPE_COLORS[pokemon.types[0]]} bg-opacity-40`}>
          <img src={pokemon.image} alt={pokemon.name} className="absolute inset-0 w-full h-full object-contain p-8" />
        </div>

        <div className="p-6">
          <p className="text-gray-500 text-sm mb-1">#{pokemon.id.toString().padStart(3, "0")}</p>
          <h1 className="text-3xl font-bold capitalize mb-4">{pokemon.name}</h1>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Tipos</h2>
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

            <div>
              <h2 className="text-xl font-semibold mb-2">Habilidades</h2>
              <div className="flex flex-col gap-2">
                {pokemon.abilities.map((ability) => (
                  <div key={ability.name} className="bg-gray-100 rounded-lg p-3">
                    <h3 className="font-medium capitalize">{ability.nameEs || ability.name}</h3>
                    {ability.descriptionEs && <p className="text-sm text-gray-600 mt-1">{ability.descriptionEs}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
