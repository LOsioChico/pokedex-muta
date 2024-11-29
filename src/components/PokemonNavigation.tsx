import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BackButton } from "./BackButton";

interface PokemonNavigationProps {
  currentId: number;
}

export const PokemonNavigation = ({ currentId }: PokemonNavigationProps) => {
  const navigate = useNavigate();
  const prevId = currentId > 1 ? currentId - 1 : null;
  const nextId = currentId < 1025 ? currentId + 1 : null; // 1025 is the total number of pokemons

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
};
