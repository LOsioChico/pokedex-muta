import { Link } from "react-router-dom";

interface ErrorStateProps {
  message: string;
}

export const ErrorState = ({ message }: ErrorStateProps) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Ups! Algo salió mal</h2>
      <p className="text-gray-600 mb-4">{message}</p>
    </div>
    <Link to="/" className="text-gray-500 hover:text-gray-700 transition-colors bg-gray-200 px-4 py-2 rounded-lg">
      Volver al inicio
    </Link>
  </div>
);
