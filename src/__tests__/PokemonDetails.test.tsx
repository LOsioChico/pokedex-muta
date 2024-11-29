import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter, useParams } from "react-router-dom";
import PokemonDetails from "../pages/PokemonDetails";
import { usePokemon } from "../hooks/usePokemon";
import { Pokemon } from "../interfaces/Pokemon";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

vi.mock("../hooks/usePokemon", () => ({
  usePokemon: vi.fn(),
}));

describe("PokemonDetails", () => {
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
    vi.mocked(useParams).mockReturnValue({ id: "1" });
  });

  it("shows loading state", () => {
    vi.mocked(usePokemon).mockReturnValue({
      pokemon: null,
      isLoading: true,
      error: null,
    });

    render(
      <BrowserRouter>
        <PokemonDetails />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("loading-spinner").className).toContain("animate-spin");
  });

  it("shows error state", () => {
    vi.mocked(usePokemon).mockReturnValue({
      pokemon: null,
      isLoading: false,
      error: new Error("Failed to load Pokemon"),
    });

    render(
      <BrowserRouter>
        <PokemonDetails />
      </BrowserRouter>,
    );

    expect(screen.getByText("Failed to load Pokemon")).toBeDefined();
    expect(screen.getByText("Volver al inicio")).toBeDefined();
  });

  it("renders pokemon details successfully", () => {
    vi.mocked(usePokemon).mockReturnValue({
      pokemon: mockPokemon,
      isLoading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <PokemonDetails />
      </BrowserRouter>,
    );

    expect(screen.getByText("#001")).toBeDefined();
    expect(screen.getByText("bulbasaur")).toBeDefined();

    expect(screen.getByText("Tipos")).toBeDefined();
    expect(screen.getByText("Planta")).toBeDefined();
    expect(screen.getByText("Veneno")).toBeDefined();

    expect(screen.getByText("Habilidades")).toBeDefined();
    expect(screen.getByText("Espesura")).toBeDefined();
    expect(screen.getByText("Aumenta los movimientos tipo planta en un apuro.")).toBeDefined();

    expect(screen.getByText("← Volver al listado")).toBeDefined();
  });

  it("uses correct pokemon id from URL params", () => {
    vi.mocked(useParams).mockReturnValue({ id: "25" });
    vi.mocked(usePokemon).mockReturnValue({
      pokemon: null,
      isLoading: true,
      error: null,
    });

    render(
      <BrowserRouter>
        <PokemonDetails />
      </BrowserRouter>,
    );

    expect(usePokemon).toHaveBeenCalledWith("25");
  });

  it("handles missing Spanish translations gracefully", () => {
    const pokemonWithoutSpanishNames: Pokemon = {
      ...mockPokemon,
      abilities: [
        {
          name: "overgrow",
          url: "https://pokeapi.co/api/v2/ability/65",
        },
      ],
    };

    vi.mocked(usePokemon).mockReturnValue({
      pokemon: pokemonWithoutSpanishNames,
      isLoading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <PokemonDetails />
      </BrowserRouter>,
    );

    expect(screen.getByText("overgrow")).toBeDefined();
  });
});
