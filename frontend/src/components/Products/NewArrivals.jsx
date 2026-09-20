import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/product-newarrivals`
        );
        setNewArrivals(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -400 : 400;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth
    );
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [newArrivals]);

  return (
    <>
    {
      isLoading ? <p className="eyebrow">Loading new arrivals</p> : <section className="bg-[var(--paper)] px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="display-title mb-3 text-5xl">
            Explore new arrivals
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--ink-soft)]">
            Discover the latest styles crafted for fashion-forward individuals.
          </p>
        </div>

        {/* Scroll Buttons */}
        <div className="flex justify-end gap-3 mb-6 pr-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-3 rounded-full shadow-md transition ${
              canScrollLeft
                ? "bg-[var(--surface-elevated)] text-[var(--ink)] hover:text-[var(--bronze-deep)]"
                : "cursor-not-allowed bg-[var(--line)] text-[var(--ink-soft)]"
            }`}
          >
            <FiChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-3 rounded-full shadow-md transition ${
              canScrollRight
                ? "bg-[var(--surface-elevated)] text-[var(--ink)] hover:text-[var(--bronze-deep)]"
                : "cursor-not-allowed bg-[var(--line)] text-[var(--ink-soft)]"
            }`}
          >
            <FiChevronRight size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`flex gap-6 overflow-x-auto scroll-smooth no-scrollbar ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {newArrivals.map((product) => (
            <div
              key={product._id}
              className="group min-w-[280px] max-w-xs overflow-hidden border border-[var(--line)] bg-[var(--surface-elevated)] shadow-xl transition-all duration-500 ease-in-out hover:-translate-y-1 hover:shadow-[var(--shadow)]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.images[0].url}
                  alt={product.images[0].altText}
                  className="w-full h-64 object-cover transform transition-transform duration-500 ease-in-out scale-105 group-hover:scale-110 group-hover:brightness-75"
                  draggable="false"
                />

                {/* Blurred background text area */}
                <div className="absolute bottom-0 left-0 w-full bg-[var(--surface-elevated)]/85 px-4 py-3 backdrop-blur-md transition-all duration-500 ease-in-out">
                  <h4 className="text-lg font-semibold transition-all duration-300 group-hover:text-xl">
                    {product.name}
                  </h4>
                  <p className="text-sm text-[var(--ink-soft)] transition-all duration-300 group-hover:text-base">
                    ${product.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    }
    </>
  );
};

export default NewArrivals;
