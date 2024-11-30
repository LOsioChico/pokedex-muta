import { describe, it, expect } from "vitest";
import { getNextPokemonId, getPreviousPokemonId } from "../pokemonIdHelpers";

describe("pokemonIdHelpers", () => {
  describe("getNextPokemonId", () => {
    it("returns next id for regular pokemon (1-1024)", () => {
      expect(getNextPokemonId(1)).toBe(2);
      expect(getNextPokemonId(24)).toBe(25);
      expect(getNextPokemonId(1024)).toBe(1025);
    });

    it("returns 10001 when current id is 1025", () => {
      expect(getNextPokemonId(1025)).toBe(10001);
    });

    it("returns next id for special pokemon (10001-10276)", () => {
      expect(getNextPokemonId(10001)).toBe(10002);
      expect(getNextPokemonId(10276)).toBe(10277);
    });

    it("returns null for last pokemon (10277)", () => {
      expect(getNextPokemonId(10277)).toBeNull();
    });

    it("returns null for invalid ids", () => {
      expect(getNextPokemonId(0)).toBe(1);
      expect(getNextPokemonId(10278)).toBeNull();
      expect(getNextPokemonId(-1)).toBeNull();
    });
  });

  describe("getPreviousPokemonId", () => {
    it("returns previous id for regular pokemon (2-1025)", () => {
      expect(getPreviousPokemonId(2)).toBe(1);
      expect(getPreviousPokemonId(25)).toBe(24);
      expect(getPreviousPokemonId(1025)).toBe(1024);
    });

    it("returns 1025 when current id is 10001", () => {
      expect(getPreviousPokemonId(10001)).toBe(1025);
    });

    it("returns previous id for special pokemon (10002-10277)", () => {
      expect(getPreviousPokemonId(10002)).toBe(10001);
      expect(getPreviousPokemonId(10277)).toBe(10276);
    });

    it("returns null for first pokemon (1)", () => {
      expect(getPreviousPokemonId(1)).toBeNull();
    });

    it("returns null for invalid ids", () => {
      expect(getPreviousPokemonId(0)).toBeNull();
      expect(getPreviousPokemonId(10278)).toBeNull();
      expect(getPreviousPokemonId(-1)).toBeNull();
    });
  });
});
