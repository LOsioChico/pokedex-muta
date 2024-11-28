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
    return pokemonResponseMapper(data, { includeAbilities: true });
  } catch {
    throw new Error("Error al cargar el Pokémon");
  }
};

export const getPokemonList = async (page: number = 1, limit: number = 20): Promise<PaginatedPokemons> => {
  const endpoint = `/pokemon?limit=${limit}&offset=${(page - 1) * limit}`;
  const { data: pokemonList } = await pokeApi.get<PokemonListResponse>(endpoint);

  const pokemonPromises = pokemonList.results.map(async (pokemonData) => {
    const { data } = await pokeApi.get(pokemonData.url);
    return pokemonResponseMapper(data, { includeAbilities: false });
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
