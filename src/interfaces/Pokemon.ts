export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: Stat[];
  height: number;
  weight: number;
}

interface Stat {
  name: string;
  value: number;
}
