import { Pokemon } from "../interfaces/Pokemon";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pokemonResponseMapper = (response: any): Pokemon => {
  const officialArtwork = response.sprites.other["official-artwork"].front_default;
  const types = response.types.map((type: { type: { name: string } }) => type.type.name);
  const abilities = response.abilities.map((ability: { ability: { name: string; url: string } }) => ({
    name: ability.ability.name,
    url: ability.ability.url,
  }));

  return {
    id: response.id,
    name: response.name,
    image: officialArtwork,
    types,
    abilities,
  };
};
