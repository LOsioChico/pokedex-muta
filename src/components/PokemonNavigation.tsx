import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BackButton } from "./BackButton";
import { getNextPokemonId, getPreviousPokemonId } from "../utils/pokemonIdHelpers";

interface PokemonNavigationProps {
  currentId: number;
}

export const PokemonNavigation = React.memo(({ currentId }: PokemonNavigationProps) => {
  const navigate = useNavigate();
  const prevId = getPreviousPokemonId(currentId);
  const nextId = getNextPokemonId(currentId);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && prevId) {
        navigate(`/pokemon/${prevId}`);
      } else if (e.key === "ArrowRight" && nextId) {
        navigate(`/pokemon/${nextId}`);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate, prevId, nextId]);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-8">
      {prevId ? (
        <Link
          to={`/pokemon/${prevId}`}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors w-full sm:w-28 text-center"
          aria-label={`Ver Pokémon #${prevId}`}
        >
          ← #{prevId.toString().padStart(3, "0")}
        </Link>
      ) : (
        <div className="hidden sm:block w-28" />
      )}

      <BackButton label="Volver al listado" />

      {nextId ? (
        <Link
          to={`/pokemon/${nextId}`}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors w-full sm:w-28 text-center"
          aria-label={`Ver Pokémon #${nextId}`}
        >
          #{nextId.toString().padStart(3, "0")} →
        </Link>
      ) : (
        <div className="hidden sm:block w-28" />
      )}
    </div>
  );
});
