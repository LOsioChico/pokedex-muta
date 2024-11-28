import { describe, it, expect, vi } from "vitest";
import { pokemonResponseMapper } from "../utils/pokemonResponseMapper";
import { pokeApi } from "../api/pokeApi";

vi.mock("../api/pokeApi", () => ({
  pokeApi: {
    get: vi.fn(),
  },
}));

describe("pokemonResponseMapper", () => {
  const mockBasicResponse = {
    id: 1,
    name: "bulbasaur",
    sprites: {
      other: {
        "official-artwork": {
          front_default: "https://example.com/bulbasaur.png",
        },
      },
    },
    types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
    abilities: [
      {
        ability: {
          name: "overgrow",
          url: "https://pokeapi.co/api/v2/ability/65",
        },
      },
    ],
  };

  const mockAbilityResponse = {
    names: [
      {
        language: { name: "es" },
        name: "Espesura",
      },
    ],
    flavor_text_entries: [
      {
        language: { name: "es" },
        flavor_text: "Potencia los\nmovimientos de\ntipo planta.",
      },
    ],
  };

  it("should map basic pokemon data without abilities", async () => {
    const result = await pokemonResponseMapper(mockBasicResponse);

    expect(result).toEqual({
      id: 1,
      name: "bulbasaur",
      image: "https://example.com/bulbasaur.png",
      types: ["grass", "poison"],
      abilities: [],
    });
  });

  it("should map pokemon data with abilities when includeAbilities is true", async () => {
    vi.mocked(pokeApi.get).mockResolvedValueOnce({ data: mockAbilityResponse });

    const result = await pokemonResponseMapper(mockBasicResponse, { includeAbilities: true });

    expect(result).toEqual({
      id: 1,
      name: "bulbasaur",
      image: "https://example.com/bulbasaur.png",
      types: ["grass", "poison"],
      abilities: [
        {
          name: "overgrow",
          url: "https://pokeapi.co/api/v2/ability/65",
          nameEs: "Espesura",
          descriptionEs: "Potencia los movimientos de tipo planta.",
        },
      ],
    });

    expect(pokeApi.get).toHaveBeenCalledWith("https://pokeapi.co/api/v2/ability/65");
  });

  it("should handle missing Spanish translations in abilities", async () => {
    const mockAbilityResponseWithoutSpanish = {
      names: [
        {
          language: { name: "en" },
          name: "Overgrow",
        },
      ],
      flavor_text_entries: [
        {
          language: { name: "en" },
          flavor_text: "Powers up grass-type moves.",
        },
      ],
    };

    vi.mocked(pokeApi.get).mockResolvedValueOnce({ data: mockAbilityResponseWithoutSpanish });

    const result = await pokemonResponseMapper(mockBasicResponse, { includeAbilities: true });

    expect(result?.abilities[0]).toEqual({
      name: "overgrow",
      url: "https://pokeapi.co/api/v2/ability/65",
      nameEs: "overgrow",
      descriptionEs: "",
    });
  });

  it("should handle API errors gracefully", async () => {
    vi.mocked(pokeApi.get).mockRejectedValueOnce(new Error("API Error"));

    const result = await pokemonResponseMapper(mockBasicResponse, { includeAbilities: true });

    expect(result).toBeNull();
    expect(Array.isArray(result?.abilities)).toBe(false);
  });

  it("should handle malformed response data gracefully", async () => {
    const malformedResponse = {
      id: 1,
      name: "bulbasaur",
      abilities: [],
    };

    const result = await pokemonResponseMapper(malformedResponse);

    expect(result).toMatchObject({
      id: 1,
      name: "bulbasaur",
      image: undefined,
    });
  });
});
