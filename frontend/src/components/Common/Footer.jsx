import React from "react";
import { Link } from "react-router-dom";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="bg-[var(--graphite)] pb-8 pt-16 text-[#eee9df]">
      <div className="content-shell grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="eyebrow mb-4 text-[#c8a87e]">E / C journal</p>
          <h4 className="display-title mb-4 text-4xl leading-none">A considered edit.</h4>
          <p className="max-w-sm text-sm leading-7 text-[#c7c1b8]">
            New pieces, quiet launches, and notes from the studio.
          </p>
          <form className="mt-6 flex max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-[#393a3b] bg-[#17181a] px-4 py-3 text-sm text-white placeholder:text-[#8d877f] focus:outline-none focus:ring-1 focus:ring-[#aa8050]"
              required
            />
            <button type="submit" className="bg-[#aa8050] px-5 py-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#0b0b0c] transition-all hover:bg-[#c39a66]">
              Join
            </button>
          </form>
        </div>

        <div>
          <h4 className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#c8a87e]">Shop</h4>
          <ul className="space-y-3 text-sm text-[#d9d3ca]">
            <li><Link to="/collections?gender=Men" className="hover:text-white">Men</Link></li>
            <li><Link to="/collections?gender=Women" className="hover:text-white">Women</Link></li>
            <li><Link to="/collections?category=Top%20Wear" className="hover:text-white">Top Wear</Link></li>
            <li><Link to="/collections?category=Bottom%20Wear" className="hover:text-white">Bottom Wear</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#c8a87e]">Support</h4>
          <ul className="space-y-3 text-sm text-[#d9d3ca]">
            <li><Link to="/collections" className="hover:text-white">Shipping</Link></li>
            <li><Link to="/profile" className="hover:text-white">Account</Link></li>
            <li><Link to="/my-order" className="hover:text-white">Orders</Link></li>
            <li><Link to="/login" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#c8a87e]">Connect</h4>
          <div className="mb-6 flex items-center gap-5 text-[#f1eee7]">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#d8c0a0]"><TbBrandMeta className="h-5 w-5" /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#d8c0a0]"><IoLogoInstagram className="h-5 w-5" /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#d8c0a0]"><RiTwitterXLine className="h-4 w-4" /></a>
          </div>
        </div>
      </div>

      <div className="content-shell mt-14">
        <div className="relative flex items-center">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#4a4947] to-transparent"></div>
          <div className="mx-6 flex items-center gap-3">
            <svg className="h-4 w-4 text-[#8b7355]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            </svg>
            <span className="text-[0.78rem] font-semibold uppercase tracking-[0.28em] text-[#c8a87e]">Est. Studio</span>
            <svg className="h-4 w-4 text-[#8b7355]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            </svg>
          </div>
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#4a4947] to-transparent"></div>
        </div>

        <div className="pt-7 pb-3 text-center">
          <p className="text-sm leading-relaxed tracking-[0.06em] text-[#aaa49b]">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold tracking-[0.1em] text-[#eee9df]">E / C Studio</span>
            <span className="mx-3 text-[#8b7355]">·</span>
            All rights reserved
            <span className="mx-3 text-[#8b7355]">·</span>
            <span className="text-[#c8a87e]">Crafted with care</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
