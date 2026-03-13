
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchItem, setSearchItem] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const currentSearchValue = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("search") || "";
  }, [location.search]);

  useEffect(() => {
    if (!isOpen) {
      setSearchItem(currentSearchValue);
    }
  }, [currentSearchValue, isOpen]);

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchItem(currentSearchValue);
    }
  };

  const applySearch = (value) => {
    const nextValue = value.trim();
    const params = new URLSearchParams(location.search);

    if (nextValue) {
      params.set("search", nextValue);
    } else {
      params.delete("search");
    }

    const query = params.toString();
    if (location.pathname === "/collections") {
      navigate(`/collections${query ? `?${query}` : ""}`);
      return;
    }

    navigate(`/collections${query ? `?${query}` : ""}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applySearch(searchItem);
    setIsOpen(false);
  };

  return (
    <div
      className={`relative flex items-center justify-center overflow-x-hidden transition-all duration-300 ${
        isOpen ? "w-[18rem] sm:w-[22rem]" : "w-auto"
      }`}
    >
      {isOpen ? (
        <form
          onSubmit={handleSearch}
          className="relative flex w-full items-center"
        >
          <button
            type="button"
            onClick={handleSearchToggle}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-200 hover:text-black"
          >
            <HiMiniXMark className="h-6 w-6" />
          </button>

          <div className="relative w-full">
            <input
              type="text"
              value={searchItem}
              placeholder="Search for products..."
              onChange={(e) => setSearchItem(e.target.value)}
              className="w-full rounded-full border border-slate-300 bg-white px-10 py-2.5 text-sm text-gray-800 placeholder-gray-500 shadow-sm transition-all duration-300 ease-in-out focus:border-black focus:outline-none focus:ring-2 focus:ring-slate-300"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 transition-colors duration-200 hover:text-black"
            >
              <HiMagnifyingGlass className="h-5 w-5" />
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={handleSearchToggle}
          className="text-slate-700 transition-all duration-300 ease-in-out hover:text-black"
          aria-label="Open search"
        >
          <HiMagnifyingGlass className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
