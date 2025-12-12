'use client';

interface PanelFooterProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalEvents: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function PanelFooter({
  currentPage,
  totalPages,
  pageSize,
  totalEvents,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange,
}: PanelFooterProps) {
  return (
    <>
      {/* Desktop footer (visible on md and up) */}
      <div className="hidden md:flex items-center justify-between p-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-3">
          <span>
            Showing {totalEvents === 0 ? 0 : startIndex + 1} to {endIndex} of {totalEvents} events
          </span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 dark:text-gray-300 cursor-pointer"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded cursor-pointer transition-all ${
              currentPage === 1
                ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600'
            }`}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            ← Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={`px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded cursor-pointer transition-all ${
              currentPage === totalPages
                ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600'
            }`}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Mobile footer (visible below md) */}
      <div className="flex md:hidden flex-row items-center justify-between gap-2 py-2 px-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {startIndex + 1}-{endIndex} of {totalEvents}
          </span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1.5 text-xs border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 dark:text-gray-300 cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            className={`px-2.5 py-1.5 text-xs border border-gray-300 dark:border-slate-600 rounded cursor-pointer transition-all ${
              currentPage === 1
                ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600'
            }`}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          <span className="text-sm min-w-10 text-center">
            {currentPage} / {totalPages}
          </span>
          <button
            className={`px-2.5 py-1.5 text-xs border border-gray-300 dark:border-slate-600 rounded cursor-pointer transition-all ${
              currentPage === totalPages
                ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600'
            }`}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      </div>
    </>
  );
}
