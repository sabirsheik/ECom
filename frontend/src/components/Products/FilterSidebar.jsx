import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSidebar = forwardRef(({ className }, ref) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const categories = ["Top Wear", "Bottom Wear"];
  const colors = ["Red", "Blue", "Black", "Green", "Gray", "White", "Pink", "Beige", "Navy", "Orange", "Brown"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = ["Cotton", "Wool", "Wash & Wear", "Silk", "Linen", "Viscose", "Fleece", "Polyester", "Leather"];
  const brands = ["Adidas", "Modern Fit", "ChicStyle", "Fashionista", "Beach Breeze", "Street Style"];
  const genders = ["Men", "Women"];

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    gender: searchParams.get("gender") || "",
    color: searchParams.get("color") || "",
    size: searchParams.get("size") ? searchParams.get("size").split(",") : [],
    material: searchParams.get("material") ? searchParams.get("material").split(",") : [],
    brand: searchParams.get("brand") ? searchParams.get("brand").split(",") : [],
    minPrice: Number(searchParams.get("minPrice") || 500),
    maxPrice: Number(searchParams.get("maxPrice") || 10000),
    minRating: Number(searchParams.get("minRating") || 0),
    availability: searchParams.get("availability") || "",
  });

  useEffect(() => {
    setFilters({
      category: searchParams.get("category") || "",
      gender: searchParams.get("gender") || "",
      color: searchParams.get("color") || "",
      size: searchParams.get("size") ? searchParams.get("size").split(",") : [],
      material: searchParams.get("material") ? searchParams.get("material").split(",") : [],
      brand: searchParams.get("brand") ? searchParams.get("brand").split(",") : [],
      minPrice: Number(searchParams.get("minPrice") || 500),
      maxPrice: Number(searchParams.get("maxPrice") || 10000),
      minRating: Number(searchParams.get("minRating") || 0),
      availability: searchParams.get("availability") || "",
    });
  }, [searchParams]);

  const applyFilters = (nextFilters) => {
    const params = new URLSearchParams();

    Object.entries(nextFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(","));
      } else if (!Array.isArray(value) && value !== "" && value !== 0) {
        params.set(key, String(value));
      }
    });

    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  const onSingleSelect = (key, value) => {
    const next = { ...filters, [key]: filters[key] === value ? "" : value };
    setFilters(next);
    applyFilters(next);
  };

  const onMultiSelect = (key, value) => {
    const exists = filters[key].includes(value);
    const next = {
      ...filters,
      [key]: exists ? filters[key].filter((item) => item !== value) : [...filters[key], value],
    };
    setFilters(next);
    applyFilters(next);
  };

  const clearFilters = () => {
    const next = {
      category: "",
      gender: "",
      color: "",
      size: [],
      material: [],
      brand: [],
      minPrice: 500,
      maxPrice: 10000,
      minRating: 0,
      availability: "",
    };
    setFilters(next);
    applyFilters(next);
  };

  const priceLabel = useMemo(() => `Rs 500 - Rs ${filters.maxPrice}`, [filters.maxPrice]);

  return (
    <aside ref={ref} className={className}>
      <div className="sticky top-0 h-screen overflow-y-auto border-r border-gray-200 bg-white p-4 transition-all duration-300">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Filters</h2>
          <button onClick={clearFilters} className="border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100">
            Clear
          </button>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase">Category</p>
          {categories.map((item) => (
            <button key={item} onClick={() => onSingleSelect("category", item)} className={`mb-2 block w-full border px-3 py-2 text-left ${filters.category === item ? "border-black bg-black text-white" : "border-gray-200"}`}>
              {item}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase">Gender</p>
          {genders.map((item) => (
            <button key={item} onClick={() => onSingleSelect("gender", item)} className={`mb-2 block w-full border px-3 py-2 text-left ${filters.gender === item ? "border-black bg-black text-white" : "border-gray-200"}`}>
              {item}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase">Price Range</p>
          <p className="mb-2 text-sm text-gray-600">{priceLabel}</p>
          <input
            type="range"
            min="500"
            max="10000"
            value={filters.maxPrice}
            onChange={(e) => {
              const next = { ...filters, minPrice: 500, maxPrice: Number(e.target.value) };
              setFilters(next);
              applyFilters(next);
            }}
            className="w-full"
          />
        </div>

        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase">Ratings</p>
          {[4, 3, 2, 1].map((r) => (
            <button key={r} onClick={() => onSingleSelect("minRating", r)} className={`mb-2 block w-full border px-3 py-2 text-left ${filters.minRating === r ? "border-black bg-black text-white" : "border-gray-200"}`}>
              {r} stars and up
            </button>
          ))}
        </div>

        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase">Availability</p>
          <button onClick={() => onSingleSelect("availability", "inStock")} className={`mb-2 block w-full border px-3 py-2 text-left ${filters.availability === "inStock" ? "border-black bg-black text-white" : "border-gray-200"}`}>
            In Stock
          </button>
          <button onClick={() => onSingleSelect("availability", "outOfStock")} className={`mb-2 block w-full border px-3 py-2 text-left ${filters.availability === "outOfStock" ? "border-black bg-black text-white" : "border-gray-200"}`}>
            Out of Stock
          </button>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase">Size</p>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((item) => (
              <button key={item} onClick={() => onMultiSelect("size", item)} className={`border px-2 py-2 text-sm ${filters.size.includes(item) ? "border-black bg-black text-white" : "border-gray-200"}`}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase">Color</p>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((item) => (
              <button
                key={item}
                onClick={() => onSingleSelect("color", item)}
                className={`h-8 border ${filters.color === item ? "border-black" : "border-gray-200"}`}
                style={{ backgroundColor: item.toLowerCase() }}
                title={item}
                aria-label={item}
              />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase">Material</p>
          {materials.map((item) => (
            <label key={item} className="mb-2 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.material.includes(item)}
                onChange={() => onMultiSelect("material", item)}
              />
              {item}
            </label>
          ))}
        </div>

        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase">Brand</p>
          {brands.map((item) => (
            <label key={item} className="mb-2 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.brand.includes(item)}
                onChange={() => onMultiSelect("brand", item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
});

export default FilterSidebar;
