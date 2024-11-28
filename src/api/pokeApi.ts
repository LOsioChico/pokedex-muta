import axios from "axios";
import { Pokemon } from "../interfaces/Pokemon";
import { pokemonResponseMapper } from "../utils/pokemonResponseMapper";
import { PokemonListResponse } from "../interfaces/PokemonListResponse";

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
  const { data: pokemonList } = await pokeApi.get<PokemonListResponse>(`/pokemon?limit=${limit}`);

  const pokemonPromises = pokemonList.results.map(async (pokemonData) => {
    const { data } = await pokeApi.get<Pokemon>(pokemonData.url);
    return pokemonResponseMapper(data);
  });

  return Promise.all(pokemonPromises);
};
