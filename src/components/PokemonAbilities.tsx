import { PokemonAbility } from "../interfaces/Pokemon";

interface PokemonAbilitiesProps {
  abilities: PokemonAbility[];
}

export const PokemonAbilities = ({ abilities }: PokemonAbilitiesProps) => (
  <div>
    <h2 className="text-xl font-semibold mb-2">Habilidades</h2>
    <div className="flex flex-col gap-2">
      {abilities.map((ability, i) => (
        <div key={ability.name + i} className="bg-gray-100 rounded-lg p-3">
          <h3 className="font-medium capitalize">{ability.nameEs || ability.name}</h3>
          {ability.descriptionEs && <p className="text-sm text-gray-600 mt-1">{ability.descriptionEs}</p>}
        </div>
      ))}
    </div>
  </div>
);
