type Pagination = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ totalPages, currentPage, onPageChange }: Pagination) {
  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-700 text-gray-200 rounded disabled:opacity-50"
      >
        Previous
      </button>

      <span className="px-2 inline-block">Page {currentPage} of {totalPages}</span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-700 text-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}