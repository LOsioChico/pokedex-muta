import axios from "axios";
import { Pokemon } from "../interfaces/Pokemon";

export const pokeApi = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getPokemon = async (id: string): Promise<Pokemon> => {
  try {
    const { data } = await pokeApi.get(`/pokemon/${id}`);

    const officialArtwork = data.sprites.other["official-artwork"].front_default;
    const types = data.types.map((type: { type: { name: string } }) => type.type.name);
    const stats = data.stats.map((stat: { stat: { name: string }; base_stat: number }) => ({
      name: stat.stat.name,
      value: stat.base_stat,
    }));

    const pokemon: Pokemon = {
      id: data.id,
      name: data.name,
      image: officialArtwork,
      types,
      stats,
      height: data.height,
      weight: data.weight,
    };

    return pokemon;
  } catch {
    throw new Error("Pokemon not found");
  }
};
