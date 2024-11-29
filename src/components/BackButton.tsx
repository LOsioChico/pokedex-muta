import { Link } from "react-router-dom";

interface BackButtonProps {
  label: string;
}

export const BackButton = ({ label }: BackButtonProps) => (
  <Link to="/" className="mb-8 inline-block bg-gray-100 px-3 py-1 rounded-full">
    {label}
  </Link>
);
