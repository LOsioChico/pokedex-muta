import { describe, it, expect, beforeEach, vi } from "vitest";
import { getPokemon, getPokemonList } from "../../api/pokeApi";
import axios from "axios";

vi.mock("axios", () => {
  return {
    default: {
      get: vi.fn(),
      create: vi.fn().mockReturnThis(),
    },
  };
});

describe("Pokemon API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPokemon", () => {
    it("fetches pokemon details successfully", async () => {
      const mockPokemonData = {
        id: 1,
        name: "bulbasaur",
        sprites: {
          other: {
            "official-artwork": {
              front_default: "bulbasaur.png",
            },
          },
        },
        types: [{ type: { name: "grass" } }],
        abilities: [],
      };

      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockPokemonData });

      const result = await getPokemon("1");
      expect(result.name).toBe("bulbasaur");
      expect(result.types).toContain("grass");
    });

    it("handles errors appropriately", async () => {
      vi.mocked(axios.get).mockRejectedValueOnce(new Error("API Error"));

      await expect(getPokemon("not-found")).rejects.toThrow("Error al cargar el Pokémon");
    });
  });

  describe("getPokemonList", () => {
    it("fetches pokemon list successfully", async () => {
      const mockListResponse = {
        count: 1,
        next: null,
        previous: null,
        results: [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" }],
      };

      const mockPokemonData = {
        id: 1,
        name: "bulbasaur",
        sprites: {
          other: {
            "official-artwork": {
              front_default: "bulbasaur.png",
            },
          },
        },
        types: [{ type: { name: "grass" } }],
        abilities: [],
      };

      vi.mocked(axios.get)
        .mockResolvedValueOnce({ data: mockListResponse })
        .mockResolvedValueOnce({ data: mockPokemonData });

      const result = await getPokemonList(1);
      expect(result.pokemons).toHaveLength(1);
      expect(result.pokemons[0].name).toBe("bulbasaur");
    });
  });
});
