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
      <div className="filter-sidebar-scroll sticky top-0 h-screen overflow-y-auto border-r border-[var(--line)] bg-[var(--surface)] px-4 pb-8 pt-4 pr-3 transition-all duration-300 sm:px-5">
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
          <h2 className="display-title text-[2.2rem] leading-none text-[var(--ink)]">Filters</h2>
          <button
            onClick={clearFilters}
            className="border border-[var(--line)] bg-[var(--surface-elevated)] px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-[var(--ink-soft)] transition-colors hover:border-[var(--bronze)] hover:text-[var(--ink)]"
          >
            Clear
          </button>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">Category</p>
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => onSingleSelect("category", item)}
              className={`mb-2 block w-full border px-3 py-2.5 text-left text-sm transition-colors ${
                filters.category === item
                  ? "border-[var(--bronze)] bg-[var(--paper)] text-[var(--ink)]"
                  : "border-[var(--line)] bg-transparent text-[var(--ink-soft)] hover:border-[var(--bronze)] hover:text-[var(--ink)]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">Gender</p>
          {genders.map((item) => (
            <button
              key={item}
              onClick={() => onSingleSelect("gender", item)}
              className={`mb-2 block w-full border px-3 py-2.5 text-left text-sm transition-colors ${
                filters.gender === item
                  ? "border-[var(--bronze)] bg-[var(--paper)] text-[var(--ink)]"
                  : "border-[var(--line)] bg-transparent text-[var(--ink-soft)] hover:border-[var(--bronze)] hover:text-[var(--ink)]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">Price Range</p>
          <p className="mb-2 text-sm text-[var(--ink-soft)]">{priceLabel}</p>
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
            className="w-full accent-[var(--bronze)]"
          />
        </div>

        <div className="mb-6">
          <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">Ratings</p>
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => onSingleSelect("minRating", r)}
              className={`mb-2 block w-full border px-3 py-2.5 text-left text-sm transition-colors ${
                filters.minRating === r
                  ? "border-[var(--bronze)] bg-[var(--paper)] text-[var(--ink)]"
                  : "border-[var(--line)] bg-transparent text-[var(--ink-soft)] hover:border-[var(--bronze)] hover:text-[var(--ink)]"
              }`}
            >
              {r} stars and up
            </button>
          ))}
        </div>

        <div className="mb-6">
          <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">Availability</p>
          <button
            onClick={() => onSingleSelect("availability", "inStock")}
            className={`mb-2 block w-full border px-3 py-2.5 text-left text-sm transition-colors ${
              filters.availability === "inStock"
                ? "border-[var(--bronze)] bg-[var(--paper)] text-[var(--ink)]"
                : "border-[var(--line)] bg-transparent text-[var(--ink-soft)] hover:border-[var(--bronze)] hover:text-[var(--ink)]"
            }`}
          >
            In Stock
          </button>
          <button
            onClick={() => onSingleSelect("availability", "outOfStock")}
            className={`mb-2 block w-full border px-3 py-2.5 text-left text-sm transition-colors ${
              filters.availability === "outOfStock"
                ? "border-[var(--bronze)] bg-[var(--paper)] text-[var(--ink)]"
                : "border-[var(--line)] bg-transparent text-[var(--ink-soft)] hover:border-[var(--bronze)] hover:text-[var(--ink)]"
            }`}
          >
            Out of Stock
          </button>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">Size</p>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((item) => (
              <button
                key={item}
                onClick={() => onMultiSelect("size", item)}
                className={`border px-2 py-2 text-sm transition-colors ${
                  filters.size.includes(item)
                    ? "border-[var(--bronze)] bg-[var(--paper)] text-[var(--ink)]"
                    : "border-[var(--line)] bg-transparent text-[var(--ink-soft)] hover:border-[var(--bronze)] hover:text-[var(--ink)]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">Color</p>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((item) => (
              <button
                key={item}
                onClick={() => onSingleSelect("color", item)}
                className={`h-8 border transition-all ${filters.color === item ? "border-[var(--bronze)] ring-1 ring-[var(--bronze)]/30" : "border-[var(--line)]"}`}
                style={{ backgroundColor: item.toLowerCase() }}
                title={item}
                aria-label={item}
              />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">Material</p>
          {materials.map((item) => (
            <label key={item} className="mb-2 flex items-center gap-2 text-sm text-[var(--ink-soft)]">
              <input
                type="checkbox"
                checked={filters.material.includes(item)}
                onChange={() => onMultiSelect("material", item)}
                className="accent-[var(--bronze)]"
              />
              {item}
            </label>
          ))}
        </div>

        <div className="mb-6">
          <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">Brand</p>
          {brands.map((item) => (
            <label key={item} className="mb-2 flex items-center gap-2 text-sm text-[var(--ink-soft)]">
              <input
                type="checkbox"
                checked={filters.brand.includes(item)}
                onChange={() => onMultiSelect("brand", item)}
                className="accent-[var(--bronze)]"
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
