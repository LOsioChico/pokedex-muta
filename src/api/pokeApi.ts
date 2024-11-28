import axios from "axios";
import { Pokemon } from "../interfaces/Pokemon";
import { pokemonResponseMapper } from "../utils/pokemonResponseMapper";

export const pokeApi = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getPokemon = async (id: string): Promise<Pokemon> => {
  try {
    const { data } = await pokeApi.get(`/pokemon/${id}`);
    return pokemonResponseMapper(data);
  } catch {
    throw new Error("Pokemon not found");
  }
};

export const getPokemonList = async (limit: number = 20): Promise<Pokemon[]> => {
  const { data } = await pokeApi.get(`/pokemon?limit=${limit}`);
  return data.results.map(pokemonResponseMapper);
};
