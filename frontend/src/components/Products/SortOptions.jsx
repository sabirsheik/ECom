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
    <div className="w-full mb-6">
      <div className="flex justify-end">
        <div className="w-full sm:w-60 relative">
          <label htmlFor="sort" className="mb-1 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">
            Sort Products
          </label>
          <select
            id="sort"
            onChange={handleSortChange}
            value={searchParams.get("sortBy") || ""}
            className="block w-full border border-[var(--line)] bg-[var(--surface-elevated)] px-4 py-2 pr-8 text-[var(--ink)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#aa8050]/20 focus:border-[var(--bronze)]"
          >
            <option value="">Newest</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="popularity">Featured</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SortOptions;
