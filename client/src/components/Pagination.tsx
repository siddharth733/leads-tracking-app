interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const isFirstPage = page <= 1;
  const isLastPage = totalPages <= 1 || page >= totalPages;

  return (
    <div className="pagination">
      <button
        type="button"
        disabled={isFirstPage}
        onClick={() => onPageChange(page - 1)}
      >
        &larr; Previous
      </button>
      <span className="pagination-info">
        Page {page} of {Math.max(1, totalPages)}
      </span>
      <button
        type="button"
        disabled={isLastPage}
        onClick={() => onPageChange(page + 1)}
      >
        Next &rarr;
      </button>
    </div>
  );
}
