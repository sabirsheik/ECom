import React from "react";
import { Link } from "react-router-dom";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { FiPhoneCall } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-[var(--graphite)] px-5 pb-8 pt-16 text-[#eee9df] sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4">
        {/* Newsletter */}
        <div>
          <p className="eyebrow mb-4 text-[#c8a87e]">E / C journal</p>
          <h4 className="display-title mb-4 text-3xl font-semibold">A considered edit.</h4>
          <p className="text-sm mb-3">
            New pieces, quiet launches, and notes from the studio.
          </p>
          <form className="flex mt-4 max-w-sm">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-[#393a3b] bg-[#17181a] px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#aa8050]"
              required
            />
            <button
              type="submit"
              className="bg-[#aa8050] px-5 py-2 text-sm text-[#0b0b0c] transition-all hover:bg-[#c39a66]"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-2 text-xs text-[#77736b]">
            For people who notice the details.
          </p>
        </div>

        {/* Shop Links */}
        <div>
          <h4 className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#c8a87e]">Shop</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="#" className="hover:text-e-hover">
                Men's Top Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-e-hover">
                Women's Top Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-e-hover">
                Men's Bottom Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-e-hover">
                Women's Bottom Wear
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#c8a87e]">Support</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="#" className="hover:text-e-hover">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-e-hover">
                About Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-e-hover">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-e-hover">
                Shipping & Returns
              </Link>
            </li>
          </ul>
        </div>

        {/* Social & Contact */}
        <div>
          <h4 className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#c8a87e]">Connect</h4>
          <div className="flex items-center space-x-5 mb-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-e-hover"
            >
              <TbBrandMeta className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-e-hover"
            >
              <IoLogoInstagram className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-e-hover"
            >
              <RiTwitterXLine className="w-5 h-5" />
            </a>
          </div>
          <div>
            <p className="text-sm font-medium">Call Us</p>
            <p className="text-sm text-[#aaa59c]">
              <FiPhoneCall className="inline-block mr-2" />
              0327-5359491
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mx-auto mt-12 max-w-[1440px] border-t border-[#393a3b] pt-6 text-center text-xs text-[#77736b]">
        <p>
          &copy; {new Date().getFullYear()} All rights reserved. Designed by{" "}
          <span className="font-medium">Sabir Ali</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
