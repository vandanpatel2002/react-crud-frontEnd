import React, { useState, useEffect } from 'react';

const Pagination = ({ currentPage, itemsPerPage, totalItems, onPageChange, onItemsPerPageChange }) => {
  const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);
  const [localItemsPerPage, setLocalItemsPerPage] = useState(itemsPerPage);

  useEffect(() => {
    setLocalCurrentPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setLocalItemsPerPage(itemsPerPage);
  }, [itemsPerPage]);

  const totalPages = Math.ceil(totalItems / localItemsPerPage);

  const displayedPages = () => {
    let start = Math.max(1, localCurrentPage - 2);
    let end = Math.min(totalPages, localCurrentPage + 2);

    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(5, totalPages);
      } else if (end === totalPages) {
        start = Math.max(totalPages - 4, 1);
      }
    }
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  };

  const rangeText = () => {
    const start = (localCurrentPage - 1) * localItemsPerPage + 1;
    const end = Math.min(totalItems, localCurrentPage * localItemsPerPage);
    return `Showing ${start}-${end} of ${totalItems}`;
  };

  const handlePageChange = (page) => {
    console.log("handlePageChange called with page:", page);
    setLocalCurrentPage(page);
    onPageChange(page);
  };

  const handleItemsPerPageChange = (event) => {
    const newValue = Number(event.target.value);
    setLocalItemsPerPage(newValue);
    onItemsPerPageChange(newValue);
  };

  return (
    <div className="card-footer justify-center md:justify-between flex-col md:flex-row gap-5 text-gray-600 text-2sm font-medium">
      <div className="flex items-center gap-2">
        Show
        <select
          className="input select select-sm w-16"
          value={localItemsPerPage}
          onChange={handleItemsPerPageChange}
        >
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        per page
        <span className="text-gray-600 font-medium">{rangeText()}</span>
        &nbsp;
        <button
          disabled={localCurrentPage === 1}
          onClick={() => handlePageChange(localCurrentPage - 1)}
          className="btn"
        >
          <span> ←</span>
        </button>

        <span className="pagination-controls flex justify-center align-center gap-2 items-center">
          {displayedPages().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`font-sfpro cursor-pointer btn pagination-items ${page === localCurrentPage ? 'text-gray-900 activepagenumber font-500' : 'text-gray-600 disactivepagenumber font-400'}`}
              disabled={displayedPages().length === 1 || page === localCurrentPage}
            >
              {page}
            </button>
          ))}
        </span>
        &nbsp;
        <button
          disabled={localCurrentPage === totalPages}
          onClick={() => handlePageChange(localCurrentPage + 1)}
          className="btn"
        >
          <span> →</span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
