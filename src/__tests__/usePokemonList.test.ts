import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePokemonList } from "../hooks/usePokemonList";
import { getPokemonList } from "../api/pokeApi";
import { PaginatedPokemons } from "../interfaces/PaginatedPokemons";

vi.mock("../api/pokeApi", () => ({
  getPokemonList: vi.fn(),
}));

describe("usePokemonList", () => {
  const mockPokemonList: PaginatedPokemons = {
    pokemons: [
      {
        id: 1,
        name: "bulbasaur",
        image: "bulbasaur.png",
        types: ["grass", "poison"],
        abilities: [],
      },
      {
        id: 2,
        name: "ivysaur",
        image: "ivysaur.png",
        types: ["grass", "poison"],
        abilities: [],
      },
    ],
    totalPages: 5,
    nextUrl: "next-url",
    previousUrl: "prev-url",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return initial loading state", () => {
    const { result } = renderHook(() => usePokemonList(1));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.pokemons).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it("should fetch and return pokemon list successfully", async () => {
    vi.mocked(getPokemonList).mockResolvedValueOnce(mockPokemonList);

    const { result } = renderHook(() => usePokemonList(1));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemons).toEqual(mockPokemonList.pokemons);
    expect(result.current.totalPages).toBe(mockPokemonList.totalPages);
    expect(result.current.error).toBe(null);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(true);
  });

  it("should handle API errors", async () => {
    const error = new Error("Error al cargar la lista de Pokémon");
    vi.mocked(getPokemonList).mockRejectedValueOnce(error);

    const { result } = renderHook(() => usePokemonList(1));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.pokemons).toEqual([]);
  });

  it("should handle page changes", async () => {
    vi.mocked(getPokemonList).mockResolvedValueOnce(mockPokemonList);

    const { result, rerender } = renderHook((page: number) => usePokemonList(page), { initialProps: 1 });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    rerender(2);

    expect(result.current.isLoading).toBe(true);
    expect(getPokemonList).toHaveBeenCalledWith(2);
  });

  it("should correctly determine hasNextPage and hasPreviousPage", async () => {
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      ...mockPokemonList,
      previousUrl: null,
    });

    const { result, rerender } = renderHook((page: number) => usePokemonList(page), { initialProps: 1 });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(false);

    vi.mocked(getPokemonList).mockResolvedValueOnce({
      ...mockPokemonList,
      nextUrl: null,
    });

    rerender(5);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPreviousPage).toBe(true);
  });

  it("should handle empty pokemon list", async () => {
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      pokemons: [],
      totalPages: 0,
      nextUrl: null,
      previousUrl: null,
    });

    const { result } = renderHook(() => usePokemonList(1));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemons).toEqual([]);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPreviousPage).toBe(false);
  });
});
