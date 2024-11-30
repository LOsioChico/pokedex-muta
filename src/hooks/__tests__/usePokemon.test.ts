import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePokemon } from "../../hooks/usePokemon";
import { getPokemon } from "../../api/pokeApi";
import { Pokemon } from "../../interfaces/Pokemon";

vi.mock("../../api/pokeApi", () => ({
  getPokemon: vi.fn(),
}));

describe("usePokemon", () => {
  const mockPokemon: Pokemon = {
    id: 1,
    name: "bulbasaur",
    image: "bulbasaur.png",
    types: ["grass", "poison"],
    abilities: [
      {
        name: "overgrow",
        url: "https://pokeapi.co/api/v2/ability/65",
        nameEs: "Espesura",
        descriptionEs: "Aumenta los movimientos tipo planta en un apuro.",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and return pokemon successfully", async () => {
    vi.mocked(getPokemon).mockResolvedValueOnce(mockPokemon);

    const { result } = renderHook(() => usePokemon("1"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon).toEqual(mockPokemon);
    expect(result.current.error).toBeNull();
    expect(getPokemon).toHaveBeenCalledWith("1");
  });

  it("should handle API errors", async () => {
    const error = new Error("Error al cargar el Pokémon");
    vi.mocked(getPokemon).mockRejectedValueOnce(error);

    const { result } = renderHook(() => usePokemon("1"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.pokemon).toBeNull();
  });

  it("should refetch when id changes", async () => {
    vi.mocked(getPokemon)
      .mockResolvedValueOnce(mockPokemon)
      .mockResolvedValueOnce({ ...mockPokemon, id: 2, name: "ivysaur" });

    const { result, rerender } = renderHook((id: string) => usePokemon(id), {
      initialProps: "1",
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon?.name).toBe("bulbasaur");

    rerender("2");

    await waitFor(() => {
      expect(result.current.pokemon?.name).toBe("ivysaur");
    });

    expect(getPokemon).toHaveBeenCalledTimes(2);
    expect(getPokemon).toHaveBeenCalledWith("1");
    expect(getPokemon).toHaveBeenCalledWith("2");
  });
});
