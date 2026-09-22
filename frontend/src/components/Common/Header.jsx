import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-[var(--line)] bg-[rgba(255,253,249,0.96)] shadow-[0_8px_30px_rgba(23,22,20,0.06)] backdrop-blur"
          : "border-transparent bg-[rgba(245,241,234,0.88)]"
      }`}
    >
      <div className="hidden border-b border-[var(--line)]/70 py-2 text-center text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[var(--ink-soft)] md:block">
        <div className="content-shell">Complimentary delivery on orders over Rs 10,000</div>
      </div>
      <div className="content-shell">
        <Navbar compact={scrolled} />
      </div>
    </header>
  );
};

export default Header;
