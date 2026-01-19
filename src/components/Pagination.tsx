"use client";

type PaginationProps = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

const Pagination = ({ page, pages, onPageChange, disabled }: PaginationProps) => {
  if (pages <= 1) return null;

  const clamp = (p: number) => Math.min(Math.max(p, 1), pages);

  const go = (p: number) => {
    if (disabled) return;
    onPageChange(clamp(p));
  };

  // simple window: 1 ... (page-1,page,page+1) ... last
  const items: (number | "...")[] = [];
  const pushRange = (from: number, to: number) => {
    for (let i = from; i <= to; i++) items.push(i);
  };

  items.push(1);
  if (page - 2 > 2) items.push("...");
  pushRange(Math.max(2, page - 1), Math.min(pages - 1, page + 1));
  if (page + 2 < pages - 1) items.push("...");
  if (pages > 1) items.push(pages);

  // remove duplicates (when pages small)
  const uniqueItems = items.filter((v, i, arr) => arr.findIndex(x => x === v) === i);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => go(page - 1)}
        disabled={disabled || page <= 1}
        className="px-3 py-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50"
      >
        Prev
      </button>

      <div className="flex items-center gap-1">
        {uniqueItems.map((it, idx) =>
          it === "..." ? (
            <span key={`dots-${idx}`} className="px-2 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={it}
              onClick={() => go(it)}
              disabled={disabled}
              className={`min-w-[36px] px-3 py-2 rounded-lg border ${
                it === page
                  ? "bg-[#EE7A67] text-white border-[#EE7A67]"
                  : "bg-white text-black border-gray-200"
              } disabled:opacity-50`}
            >
              {it}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => go(page + 1)}
        disabled={disabled || page >= pages}
        className="px-3 py-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
