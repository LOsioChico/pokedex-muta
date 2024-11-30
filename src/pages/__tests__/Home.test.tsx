import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "../Home";
import { getPokemonList } from "../../api/pokeApi";
import { PaginatedPokemons } from "../../interfaces/PaginatedPokemons";

vi.mock("../../api/pokeApi");
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
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "bulba" } });
    });

    await waitFor(() => {
      expect(screen.getByText("bulbasaur")).toBeDefined();
      expect(screen.queryByText("ivysaur")).toBeNull();
    });
  });

  it("handles pagination correctly", async () => {
    vi.mocked(getPokemonList).mockResolvedValue({
      ...mockPokemons,
      previousUrl: "prev-url",
      nextUrl: "next-url",
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>,
      );
    });

    const nextButton = screen.getByText("Siguiente");
    await act(async () => {
      fireEvent.click(nextButton);
    });

    const previousButton = screen.getByText("Anterior");
    await act(async () => {
      fireEvent.click(previousButton);
    });

    expect(getPokemonList).toHaveBeenCalledWith(1);
    expect(getPokemonList).toHaveBeenCalledWith(2);
    expect(getPokemonList).toHaveBeenCalledWith(1);
  });

  it("disables pagination buttons appropriately", async () => {
    vi.mocked(getPokemonList).mockResolvedValueOnce({
      ...mockPokemons,
      previousUrl: null,
      nextUrl: "next-url",
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>,
      );
    });

    const previousButton = () => screen.getByText("Anterior");
    const nextButton = () => screen.getByText("Siguiente");

    await waitFor(() => {
      expect(previousButton().hasAttribute("disabled")).toBe(true);
      expect(nextButton().hasAttribute("disabled")).toBe(false);
    });

    vi.mocked(getPokemonList).mockResolvedValueOnce({
      ...mockPokemons,
      previousUrl: "prev-url",
      nextUrl: null,
    });

    await act(async () => {
      fireEvent.click(nextButton());
    });

    await waitFor(() => {
      expect(previousButton().hasAttribute("disabled")).toBe(false);
      expect(nextButton().hasAttribute("disabled")).toBe(true);
    });
  });

  it("hides pagination when searching", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>,
      );
    });

    expect(screen.getByText("Siguiente")).toBeDefined();
    expect(screen.getByText("Anterior")).toBeDefined();

    const searchInput = screen.getByPlaceholderText("Buscar Pokémon...");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "bulba" } });
    });

    await waitFor(() => {
      expect(screen.queryByText("Siguiente")).toBeNull();
      expect(screen.queryByText("Anterior")).toBeNull();
    });
  });

  it("shows no results message when search yields no matches", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>,
      );
    });

    const searchInput = screen.getByPlaceholderText("Buscar Pokémon...");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "xyz" } });
    });

    await waitFor(() => {
      expect(screen.getByText('No se encontraron Pokémon que coincidan con "xyz"')).toBeDefined();
      expect(screen.queryByText("bulbasaur")).toBeNull();
      expect(screen.queryByText("ivysaur")).toBeNull();
    });
  });

  it("handles API errors gracefully", async () => {
    vi.mocked(getPokemonList).mockRejectedValueOnce(new Error("Error al cargar la lista de Pokémon"));

    await act(async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>,
      );
    });

    expect(screen.getByText("¡Ups! Algo salió mal")).toBeDefined();
    expect(screen.getByText("Error al cargar la lista de Pokémon")).toBeDefined();
    expect(screen.getByText("Volver al inicio")).toBeDefined();
  });
});
