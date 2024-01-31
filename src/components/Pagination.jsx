/* eslint-disable react/prop-types */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onPrev,
  onNext,
  onFirst,
  onLast,
  totalData,
  pageSize,
}) {
  const nearbyPages = 2;
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const startPage = Math.max(1, currentPage - nearbyPages);
  const endPage = Math.min(totalPages, currentPage + nearbyPages);

  const showingFrom = (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, totalData);

  const pagesToShow = pageNumbers.slice(startPage - 1, endPage);
  return (
    <>
      <nav
        className="flex items-center flex-column flex-wrap md:flex-row justify-between p-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
          Showing{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {showingFrom}-{showingTo + ' '}
          </span>
          of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {totalData}
          </span>
        </span>
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
          <li>
            <a
              href="#"
              onClick={onFirst}
              className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight  bg-white border border-gray-300 rounded-s-lg ${
                currentPage === 1
                  ? 'text-gray-400 pointer-events-none cursor-default'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              First
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={onPrev}
              className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight  bg-white border border-gray-300 ${
                currentPage === 1
                  ? 'text-gray-400 pointer-events-none cursor-default'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              Previous
            </a>
          </li>
          {pagesToShow.map((number) => {
            return (
              <li key={number}>
                <a
                  href="#"
                  onClick={() => onPageChange(number)}
                  className={`flex items-center justify-center px-3 h-8 leading-tight ${
                    currentPage === number
                      ? 'text-gray-700 bg-gray-100'
                      : 'text-gray-500 bg-white'
                  } border border-gray-300 hover:bg-gray-100 hover:text-gray-700 `}
                >
                  {number}
                </a>
              </li>
            );
          })}
          <li>
            <a
              href="#"
              onClick={onNext}
              className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight  bg-white border border-gray-300 ${
                currentPage === totalPages
                  ? 'text-gray-400 pointer-events-none cursor-default'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              Next
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={onLast}
              className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight  bg-white border border-gray-300 rounded-e-lg ${
                currentPage === totalPages
                  ? 'text-gray-400 pointer-events-none cursor-default'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              Last
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
