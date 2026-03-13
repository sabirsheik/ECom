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
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Sort Products
          </label>
          <select
            id="sort"
            onChange={handleSortChange}
            value={searchParams.get("sortBy") || ""}
            className="block w-full px-4 py-2 pr-8 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Default</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SortOptions;
