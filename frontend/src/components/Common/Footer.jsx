import React from "react";
import { Link } from "react-router-dom";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { FiPhoneCall } from "react-icons/fi";

const Footer = () => {
  return (
    // Footer Secton
    <footer className="bg-gray-100 text-gray-800 pt-16 pb-8 px-4 lg:px-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* Newsletter */}
        <div>
          <h4 className="text-xl font-bold mb-4">Stay Updated</h4>
          <p className="text-sm mb-3">
            Be the first to hear about new arrivals, sales, and special offers.
          </p>
          <form className="flex mt-4 max-w-sm">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-700"
              required
            />
            <button
              type="submit"
              className="bg-e-black text-white px-5 py-2 rounded-r-md text-sm hover:bg-e-hover transition-all"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Get 10% off on your first order.
          </p>
        </div>

        {/* Shop Links */}
        <div>
          <h4 className="text-xl font-bold mb-4">Shop</h4>
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
          <h4 className="text-xl font-bold mb-4">Support</h4>
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
          <h4 className="text-xl font-bold mb-4">Connect With Us</h4>
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
            <p className="text-sm text-gray-600">
              <FiPhoneCall className="inline-block mr-2" />
              0327-5359491
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 border-t pt-6 text-center text-xs text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} All rights reserved. Designed by{" "}
          <span className="font-medium">Sabir Ali</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
