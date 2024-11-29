export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: PokemonType[];
  abilities: PokemonAbility[];
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

export type PokemonAbility = {
  name: string;
  url: string;
  nameEs?: string;
  descriptionEs?: string;
};
