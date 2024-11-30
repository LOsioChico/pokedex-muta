import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { PokemonNavigation } from "../PokemonNavigation";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("PokemonNavigation", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it("renders navigation buttons correctly for a middle pokemon", () => {
    render(
      <BrowserRouter>
        <PokemonNavigation currentId={25} />
      </BrowserRouter>,
    );

    expect(screen.getByText("← #024")).toBeDefined();
    expect(screen.getByText("#026 →")).toBeDefined();
    expect(screen.getByText("Volver al listado")).toBeDefined();
  });

  it("hides previous button for first pokemon", () => {
    render(
      <BrowserRouter>
        <PokemonNavigation currentId={1} />
      </BrowserRouter>,
    );

    expect(screen.queryByText(/← #000/)).toBeNull();
    expect(screen.getByText("#002 →")).toBeDefined();
  });

  it("hides next button for last pokemon", () => {
    render(
      <BrowserRouter>
        <PokemonNavigation currentId={10277} />
      </BrowserRouter>,
    );

    expect(screen.getByText("← #10276")).toBeDefined();
    expect(screen.queryByText(/#10278 →/)).toBeNull();
  });

  it("navigates to previous pokemon on left arrow key press", () => {
    render(
      <BrowserRouter>
        <PokemonNavigation currentId={25} />
      </BrowserRouter>,
    );

    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(mockNavigate).toHaveBeenCalledWith("/pokemon/24");
  });

  it("navigates to next pokemon on right arrow key press", () => {
    render(
      <BrowserRouter>
        <PokemonNavigation currentId={25} />
      </BrowserRouter>,
    );

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(mockNavigate).toHaveBeenCalledWith("/pokemon/26");
  });

  it("does not navigate on left arrow key press when at first pokemon", () => {
    render(
      <BrowserRouter>
        <PokemonNavigation currentId={1} />
      </BrowserRouter>,
    );

    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("does not navigate on right arrow key press when at last pokemon", () => {
    render(
      <BrowserRouter>
        <PokemonNavigation currentId={10277} />
      </BrowserRouter>,
    );

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("has correct aria-labels for navigation buttons", () => {
    render(
      <BrowserRouter>
        <PokemonNavigation currentId={25} />
      </BrowserRouter>,
    );

    expect(screen.getByLabelText("Ver Pokémon #24")).toBeDefined();
    expect(screen.getByLabelText("Ver Pokémon #26")).toBeDefined();
  });
});
