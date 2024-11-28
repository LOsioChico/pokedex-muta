import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import { getPokemonList } from "../api/pokeApi";
import { PaginatedPokemons } from "../interfaces/PaginatedPokemons";

vi.mock("../api/pokeApi");
const mockPokemons: PaginatedPokemons = {
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
  totalPages: 1,
  nextUrl: null,
  previousUrl: null,
};

describe("Home Component", () => {
  beforeEach(() => {
    vi.mocked(getPokemonList).mockResolvedValue(mockPokemons);
  });

  it("renders pokemon list", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>,
      );
    });

    expect(screen.getByText("bulbasaur")).toBeDefined();
    expect(screen.getByText("ivysaur")).toBeDefined();
  });

  it("filters pokemon based on search term", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>,
      );
    });

    expect(screen.getByText("bulbasaur")).toBeDefined();

    const searchInput = screen.getByPlaceholderText("Buscar Pokémon...");
    fireEvent.change(searchInput, { target: { value: "bulba" } });

    await waitFor(() => {
      expect(screen.getByText("bulbasaur")).toBeDefined();
      expect(screen.queryByText("ivysaur")).toBeNull();
    });
  });
});
