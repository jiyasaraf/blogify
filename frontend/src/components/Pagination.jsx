// src/components/Pagination.jsx
import React, { useMemo } from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const MAX_PAGE_BUTTONS = 7;

  const getPageNumbers = useMemo(() => {
    let start = 1,
      end = totalPages;
    if (totalPages > MAX_PAGE_BUTTONS) {
      const sideCount = Math.floor(MAX_PAGE_BUTTONS / 2);
      start = Math.max(1, currentPage - sideCount);
      end = Math.min(totalPages, currentPage + sideCount);
      if (end - start + 1 < MAX_PAGE_BUTTONS) {
        if (start === 1) end = Math.min(totalPages, start + MAX_PAGE_BUTTONS - 1);
        else if (end === totalPages) start = Math.max(1, end - MAX_PAGE_BUTTONS + 1);
      }
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [totalPages, currentPage]);

  return (
    <div className="flex justify-center items-center mt-8 p-4 bg-gray-50 rounded-xl shadow-inner">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 mx-2 text-gray-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        &larr; Previous
      </button>

      {totalPages > 7 && getPageNumbers[0] > 1 && <span className="px-4 py-2 text-gray-500">...</span>}

      {getPageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 mx-1 text-sm font-medium rounded-lg transition duration-150 ${
            page === currentPage
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      {totalPages > 7 && getPageNumbers[getPageNumbers.length - 1] < totalPages && (
        <span className="px-4 py-2 text-gray-500">...</span>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 mx-2 text-gray-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Next &rarr;
      </button>
    </div>
  );
};

export default Pagination;
