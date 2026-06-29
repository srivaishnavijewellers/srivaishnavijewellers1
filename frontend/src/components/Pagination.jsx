const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-2xl border border-[#ead7b4] bg-white px-4 py-2 text-sm font-semibold text-mocha-900 disabled:opacity-40"
      >
        Previous
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
            currentPage === page
              ? "bg-[#d5ad58] text-mocha-900"
              : "border border-[#ead7b4] bg-white text-mocha-900"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-2xl border border-[#ead7b4] bg-white px-4 py-2 text-sm font-semibold text-mocha-900 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

