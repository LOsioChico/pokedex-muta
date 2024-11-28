/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pokemon } from "../interfaces/Pokemon";
import { pokeApi } from "../api/pokeApi";

interface MapperOptions {
  includeAbilities?: boolean;
}

export const pokemonResponseMapper = async (
  response: any,
  options: MapperOptions = { includeAbilities: false },
): Promise<Pokemon | null> => {
  try {
    const officialArtwork = response?.sprites?.other["official-artwork"]?.front_default;
    const types = response?.types?.map((type: { type: { name: string } }) => type.type.name);

    let abilities = [];
    if (options.includeAbilities) {
      const abilitiesPromises = response?.abilities?.map(
        async (ability: { ability: { name: string; url: string } }) => {
          const { data } = await pokeApi.get(ability.ability.url);

          const nameEs = data?.names?.find((name: any) => name.language.name === "es")?.name || ability.ability.name;
          const descriptionEs =
            data?.flavor_text_entries
              ?.find((entry: any) => entry.language.name === "es")
              ?.flavor_text?.replace(/\n/g, " ") || "";

          return {
            name: ability.ability.name,
            url: ability.ability.url,
            nameEs,
            descriptionEs,
          };
        },
      );

      abilities = await Promise.all(abilitiesPromises);
    }

    return {
      id: response.id,
      name: response.name,
      image: officialArtwork,
      types,
      abilities,
    };
  } catch {
    return null;
  }
};
