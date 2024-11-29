import React from "react";
import { PokemonType } from "../interfaces/Pokemon";
import { TYPE_COLORS, TYPE_TEXT_COLORS } from "../utils/pokemonTypeColors";
import { POKEMON_TYPE_TRANSLATIONS } from "../utils/pokemonTypeTranslations";

interface PokemonTypesProps {
  types: PokemonType[];
}

export const PokemonTypes = React.memo(({ types }: PokemonTypesProps) => (
  <div>
    <h2 className="text-xl font-semibold mb-2">Tipos</h2>
    <div className="flex flex-wrap gap-2">
      {types.map((type) => (
        <span
          key={type}
          className={`px-3 py-1 rounded-full capitalize text-sm font-medium ${TYPE_COLORS[type]} ${TYPE_TEXT_COLORS[type]}`}
        >
          {POKEMON_TYPE_TRANSLATIONS[type]}
        </span>
      ))}
    </div>
  </div>
));
