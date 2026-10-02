import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    searchParams.set("sortBy", sortBy);
    setSearchParams(searchParams);
  };

  return (
    <div className="mb-6 w-full">
      <div className="flex justify-end">
        <div className="relative w-full sm:w-60">
          <label htmlFor="sort" className="mb-1 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">
            Sort Products
          </label>
          <div className="relative">
            <select
              id="sort"
              onChange={handleSortChange}
              value={searchParams.get("sortBy") || ""}
              className="sort-select block w-full appearance-none border border-[var(--line)] bg-[var(--surface-elevated)] px-4 py-3 pr-10 text-base text-[var(--ink)] shadow-none transition-colors duration-200 focus:border-[var(--bronze)] focus:outline-none focus:ring-2 focus:ring-[rgba(161,122,80,0.12)]"
            >
              <option value="">Newest</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="popularity">Featured</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--ink)]">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortOptions;
