import React from 'react'
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'
import { PaginationProps } from '@/models/UIModels'
import { paginateUtils } from '@/services/UIService'

export default function Pagination({
  page,
  pageSize,
  total,
  pageSizes,
  onPaginate,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = false,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  const pages = paginateUtils(totalPages, page, siblingCount, boundaryCount);

  const change = (newPage: number, newSize = pageSize) => {
    if (newPage < 1 || newPage > totalPages) return;
    onPaginate({ page: newPage, pageSize: newSize });
  };

  return (
    <div className="flex flex-wrap items-center justify-between py-4">
      {/* page size selector */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium">Show</label>
        <select
          value={pageSize}
          onChange={(e) => change(1, +e.target.value)}
          className="px-2 py-1 border rounded text-sm"
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* page buttons */}
      <nav aria-label="Pagination">
        <ul className="inline-flex items-center space-x-1">
          {showFirstLast && (
            <li>
              <button
                onClick={() => change(1)}
                disabled={page === 1}
                className="p-2 rounded disabled:opacity-50"
                aria-label="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
            </li>
          )}

          <li>
            <button
              onClick={() => change(page - 1)}
              disabled={page === 1}
              className="p-2 rounded disabled:opacity-50"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </li>

          {pages.map((p, i) =>
            p === "…" ? (
              <li key={`dot-${i}`} className="px-2 select-none">
                …
              </li>
            ) : (
              <li key={p}>
                <button
                  onClick={() => change(p as number)}
                  aria-current={p === page ? "page" : undefined}
                  className={`
                    px-3 py-1 border rounded
                    ${
                      p === page
                        ? "bg-blue-500 text-white border-transparent"
                        : "hover:bg-gray-100"
                    }
                  `}
                >
                  {p}
                </button>
              </li>
            )
          )}

          <li>
            <button
              onClick={() => change(page + 1)}
              disabled={page === totalPages}
              className="p-2 rounded disabled:opacity-50"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </li>

          {showFirstLast && (
            <li>
              <button
                onClick={() => change(totalPages)}
                disabled={page === totalPages}
                className="p-2 rounded disabled:opacity-50"
                aria-label="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}