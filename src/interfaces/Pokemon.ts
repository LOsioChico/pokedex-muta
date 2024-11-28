export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: PokemonType[];
  stats: Stat[];
  height: number;
  weight: number;
}

export type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

interface Stat {
  name: string;
  value: number;
}
