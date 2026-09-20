import React, { useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProductsByFilters } from "../redux/slices/ProductSlice";

const CollectionPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { products, loading, error } = useSelector((state) => state.product);
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const activeFilterCount = [...searchParams.keys()].filter((key) => key !== "sortBy" && searchParams.get(key)).length;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleClickOutside = (e) => {
    if(sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    dispatch(
      fetchProductsByFilters({
        collection: params.collection,
        category: params.category,
        gender: params.gender,
        sizes: params.size,
        colors: params.color,
        material: params.material,
        brand: params.brand,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        minRating: params.minRating,
        availability: params.availability,
        sortBy: params.sortBy,
        search: params.search,
      })
    );
  }, [dispatch, searchParams]);
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <div ref={sidebarRef} className="flex flex-col gap-8 lg:flex-row">
        {/* Mobile Filter Button */}
        <button
          onClick={toggleSidebar}
            className="flex items-center justify-center gap-2 border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] lg:hidden"
        >
            <SlidersHorizontal size={16} strokeWidth={1.5} />
            Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
        </button>
          {isSidebarOpen && <button aria-label="Close filters" onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/30 lg:hidden" />}
        {/* Filter Sidebar */}
        <div>
          <FilterSidebar
            ref={sidebarRef}
            className={`${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } fixed inset-y-0 left-0 z-50 w-[min(88vw,22rem)] overflow-y-auto bg-[var(--surface)] transition-transform duration-300 lg:static lg:z-auto lg:w-64 lg:translate-x-0`}
          />
        </div>
        <div className="min-w-0 flex-grow">
          <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[var(--line)] pb-6 sm:flex-row sm:items-end">
            <div><p className="eyebrow mb-2">The catalogue</p><h1 className="display-title text-5xl">All collection</h1></div>
            <p className="text-sm text-[var(--ink-soft)]">Discover pieces for the everyday edit.</p>
          </div>

            {/* Sort Options */}
             <SortOptions />
             {/* Product Grid */}
             <ProductGrid products={products} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
