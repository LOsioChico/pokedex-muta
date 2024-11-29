interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div className="mb-8">
    <input
      type="text"
      placeholder="Buscar Pokémon..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full max-w-md mx-auto block px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
    />
  </div>
);
