import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
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
    <>                                                             
      <div ref={sidebarRef} className="flex flex-col lg:flex-row">
        {/* Mobile Filter Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden border p-2 flex justify-center items-center"
        >
          <FaFilter className="mr-2" />
        </button>
        {/* Filter Sidebar */}
        <div>
          <FilterSidebar
            ref={sidebarRef}
            className={`${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
          />
        </div>
        <div className="flex-grow p-4">
            <h2 className="text-2xl uppercase mb-4">
                All Collection
            </h2>

            {/* Sort Options */}
             <SortOptions />
             {/* Product Grid */}
             <ProductGrid products={products} loading={loading} error={error} />
        </div>
      </div>
    </>
  );
};

export default CollectionPage;
