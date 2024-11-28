import { Pokemon } from "../interfaces/Pokemon";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pokemonResponseMapper = (response: any): Pokemon => {
  const officialArtwork = response.sprites.other["official-artwork"].front_default;
  const types = response.types.map((type: { type: { name: string } }) => type.type.name);
  const stats = response.stats.map((stat: { stat: { name: string }; base_stat: number }) => ({
    name: stat.stat.name,
    value: stat.base_stat,
  }));

  return {
    id: response.id,
    name: response.name,
    image: officialArtwork,
    types,
    stats,
    height: response.height,
    weight: response.weight,
  };
};
