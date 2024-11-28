import axios from "axios";
import { Pokemon } from "../interfaces/Pokemon";
import { pokemonResponseMapper } from "../utils/pokemonResponseMapper";
import { PokemonListResponse } from "../interfaces/PokemonListResponse";
import { PaginatedPokemons } from "../interfaces/PaginatedPokemons";

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

export const getPokemonList = async (url?: string | null, limit: number = 12): Promise<PaginatedPokemons> => {
  const endpoint = url || `/pokemon?limit=${limit}`;
  const { data: pokemonList } = await pokeApi.get<PokemonListResponse>(endpoint);

  const pokemonPromises = pokemonList.results.map(async (pokemonData) => {
    const { data } = await pokeApi.get(pokemonData.url);
    return pokemonResponseMapper(data);
  });

  const pokemons = await Promise.all(pokemonPromises);
  const totalPages = Math.ceil(pokemonList.count / limit);

  return {
    pokemons,
    totalPages,
    nextUrl: pokemonList.next,
    previousUrl: pokemonList.previous,
  };
};
