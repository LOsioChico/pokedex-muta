// 1025 is the total number of pokemons but then starts from 10001 to 10277

export const getNextPokemonId = (currentId: number): number | null => {
  if (currentId < 1025 && currentId >= 0) return currentId + 1;
  if (currentId === 1025) return 10001;
  if (currentId >= 10001 && currentId < 10277) return currentId + 1;
  return null;
};

export const getPreviousPokemonId = (currentId: number): number | null => {
  if (currentId > 10001 && currentId <= 10277) return currentId - 1;
  if (currentId === 10001) return 1025;
  if (currentId > 1 && currentId <= 1025) return currentId - 1;
  return null;
};
