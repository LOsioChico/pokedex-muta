interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
}: PaginationProps) => (
  <div className="mt-8 flex justify-center gap-2">
    <button
      onClick={onPreviousPage}
      disabled={!hasPreviousPage}
      className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition-colors"
    >
      Anterior
    </button>
    <span className="px-4 py-2">
      Página {currentPage} de {totalPages}
    </span>
    <button
      onClick={onNextPage}
      disabled={!hasNextPage}
      className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition-colors"
    >
      Siguiente
    </button>
  </div>
);
