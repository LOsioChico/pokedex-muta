import { useParams } from "react-router-dom";
import { usePokemon } from "../hooks/usePokemon";
import { TYPE_COLORS } from "../utils/pokemonTypeColors";
import { LoadingSpinner, ErrorState, BackButton, PokemonTypes, PokemonAbilities } from "../components";

const PokemonDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { pokemon, isLoading, error } = usePokemon(id!);

  if (isLoading) return <LoadingSpinner />;
  if (error || !pokemon) return <ErrorState message={error?.message || "Pokémon no encontrado"} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton label="← Volver al listado" />

      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto">
        <div className={`aspect-video relative bg-gradient-to-br ${TYPE_COLORS[pokemon.types[0]]} bg-opacity-40`}>
          <img src={pokemon.image} alt={pokemon.name} className="absolute inset-0 w-full h-full object-contain p-8" />
        </div>

        <div className="p-6">
          <p className="text-gray-500 text-sm mb-1">#{pokemon.id.toString().padStart(3, "0")}</p>
          <h1 className="text-3xl font-bold capitalize mb-4">{pokemon.name}</h1>

          <div className="space-y-4">
            <PokemonTypes types={pokemon.types} />
            <PokemonAbilities abilities={pokemon.abilities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
