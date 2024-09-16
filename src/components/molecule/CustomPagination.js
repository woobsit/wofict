import React from "react";
import { Pagination } from "react-bootstrap";
import PropTypes from "prop-types";

const CustomPagination = ({ totalPages, currentPage, onPageChange }) => {
  const getVisiblePages = () => {
    const visiblePages = [];
    let startPage;
    let endPage;

    if (totalPages <= 5) {
      // Less than 5 pages, show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // More than 5 pages, calculate start and end page
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  const handlePageChange = (pageNumber) => {
    if (
      pageNumber > 0 &&
      pageNumber <= totalPages &&
      pageNumber !== currentPage
    ) {
      onPageChange(pageNumber);
    }
  };

  const visiblePages = getVisiblePages();

  return (
    <Pagination>
      <Pagination.First
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      />
      <Pagination.Prev
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />

      {visiblePages.map((page) => (
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      ))}

      {totalPages > 5 && currentPage < totalPages - 2 && (
        <>
          <Pagination.Ellipsis />
          <Pagination.Item onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </Pagination.Item>
        </>
      )}

      <Pagination.Next
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
      <Pagination.Last
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    </Pagination>
  );
};

// Typechecking props for the Button
CustomPagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default CustomPagination;
