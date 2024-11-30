import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSearchPokemon } from "../useSearchPokemon";
import { getPokemon } from "../../api/pokeApi";
import { Pokemon } from "../../interfaces/Pokemon";

vi.mock("../../api/pokeApi", () => ({
  getPokemon: vi.fn(),
}));

describe("useSearchPokemon", () => {
  const mockPokemons: Pokemon[] = [
    { id: 1, name: "bulbasaur", image: "", types: [], abilities: [] },
    { id: 2, name: "ivysaur", image: "", types: [], abilities: [] },
    { id: 25, name: "pikachu", image: "", types: [], abilities: [] },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all pokemons when search term is empty", () => {
    const { result } = renderHook(() =>
      useSearchPokemon({
        pokemons: mockPokemons,
        searchTerm: "",
      }),
    );

    expect(result.current.filteredPokemons).toEqual(mockPokemons);
    expect(result.current.isSearching).toBe(false);
  });

  it("filters pokemons locally when there are matches", () => {
    const { result } = renderHook(() =>
      useSearchPokemon({
        pokemons: mockPokemons,
        searchTerm: "saur",
      }),
    );

    expect(result.current.filteredPokemons).toHaveLength(2);
    expect(result.current.filteredPokemons.map((p) => p.name)).toEqual(["bulbasaur", "ivysaur"]);
    expect(getPokemon).not.toHaveBeenCalled();
  });

  it("performs case-insensitive search", () => {
    const { result } = renderHook(() =>
      useSearchPokemon({
        pokemons: mockPokemons,
        searchTerm: "PIKA",
      }),
    );

    expect(result.current.filteredPokemons).toHaveLength(1);
    expect(result.current.filteredPokemons[0].name).toBe("pikachu");
    expect(getPokemon).not.toHaveBeenCalled();
  });

  it("searches API when no local matches are found", async () => {
    const mockApiPokemon: Pokemon = { id: 150, name: "mewtwo", image: "", types: [], abilities: [] };
    vi.mocked(getPokemon).mockResolvedValueOnce(mockApiPokemon);

    const { result } = renderHook(() =>
      useSearchPokemon({
        pokemons: mockPokemons,
        searchTerm: "mewtwo",
      }),
    );

    expect(result.current.isSearching).toBe(true);
    expect(result.current.filteredPokemons).toEqual([]);

    await waitFor(() => {
      expect(result.current.isSearching).toBe(false);
      expect(result.current.filteredPokemons).toEqual([mockApiPokemon]);
    });

    expect(getPokemon).toHaveBeenCalledWith("mewtwo");
  });

  it("handles API errors gracefully", async () => {
    vi.mocked(getPokemon).mockRejectedValueOnce(new Error("API Error"));

    const { result } = renderHook(() =>
      useSearchPokemon({
        pokemons: mockPokemons,
        searchTerm: "nonexistent",
      }),
    );

    expect(result.current.isSearching).toBe(true);
    expect(result.current.filteredPokemons).toEqual([]);

    await waitFor(() => {
      expect(result.current.isSearching).toBe(false);
      expect(result.current.filteredPokemons).toEqual([]);
    });
  });

  it("clears search results when search term becomes empty", async () => {
    const mockApiPokemon: Pokemon = { id: 150, name: "mewtwo", image: "", types: [], abilities: [] };
    vi.mocked(getPokemon).mockResolvedValueOnce(mockApiPokemon);

    const { result, rerender } = renderHook(
      ({ searchTerm }) =>
        useSearchPokemon({
          pokemons: mockPokemons,
          searchTerm,
        }),
      {
        initialProps: { searchTerm: "mewtwo" },
      },
    );

    await waitFor(() => {
      expect(result.current.filteredPokemons).toEqual([mockApiPokemon]);
    });

    rerender({ searchTerm: "" });

    expect(result.current.filteredPokemons).toEqual(mockPokemons);
    expect(result.current.isSearching).toBe(false);
  });

  it("clears search results when local matches become available", async () => {
    const mockApiPokemon: Pokemon = { id: 150, name: "mewtwo", image: "", types: [], abilities: [] };
    vi.mocked(getPokemon).mockResolvedValueOnce(mockApiPokemon);

    const { result, rerender } = renderHook(
      ({ pokemons }) =>
        useSearchPokemon({
          pokemons,
          searchTerm: "mewtwo",
        }),
      {
        initialProps: { pokemons: mockPokemons },
      },
    );

    await waitFor(() => {
      expect(result.current.filteredPokemons).toEqual([mockApiPokemon]);
    });

    rerender({ pokemons: [...mockPokemons, mockApiPokemon] });

    expect(result.current.filteredPokemons).toEqual([mockApiPokemon]);
    expect(result.current.isSearching).toBe(false);
  });
});
