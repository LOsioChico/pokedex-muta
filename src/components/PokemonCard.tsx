import { Link } from "react-router-dom";
import { Pokemon } from "../interfaces/Pokemon";
import { TYPE_COLORS, TYPE_TEXT_COLORS } from "../utils/pokemonTypeColors";
import { POKEMON_TYPE_TRANSLATIONS } from "../utils/pokemonTypeTranslations";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export const PokemonCard = ({ pokemon }: PokemonCardProps) => (
  <Link
    key={pokemon.id}
    to={`/pokemon/${pokemon.id}`}
    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
  >
    <div className={`aspect-square relative bg-gradient-to-br ${TYPE_COLORS[pokemon.types[0]]} bg-opacity-40`}>
      <img
        src={pokemon.image}
        alt={pokemon.name}
        loading="lazy"
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
);
