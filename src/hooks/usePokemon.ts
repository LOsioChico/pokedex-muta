import { useEffect, useState } from "react";
import { pokeApi } from "../api/pokeApi";
import { type Pokemon } from "../interfaces/Pokemon";

export const usePokemon = (id: string) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPokemon(id)
      .then(setPokemon)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [id]);

  return { pokemon, isLoading, error };
};

const getPokemon = async (id: string): Promise<Pokemon> => {
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
