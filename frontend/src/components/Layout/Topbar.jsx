import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { FiFacebook } from "react-icons/fi";

const Topbar = () => {
  return (
    <>
      <div className="border-b border-slate-200 bg-white text-slate-700">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="hidden items-center space-x-4 md:flex">
            <a href="#" className="transition-colors duration-300 hover:text-black" aria-label="Meta">
              <TbBrandMeta className="h-5 w-5" />
            </a>
            <a href="#" className="transition-colors duration-300 hover:text-black" aria-label="Instagram">
              <IoLogoInstagram className="h-5 w-5" />
            </a>
            <a href="#" className="transition-colors duration-300 hover:text-black" aria-label="Twitter">
              <RiTwitterXLine className="h-4 w-4" />
            </a>
            <a href="#" className="transition-colors duration-300 hover:text-black" aria-label="Facebook">
              <FiFacebook className="h-4 w-4" />
            </a>
          </div>

          <div className="flex-grow text-center text-xs tracking-wide sm:text-sm">
            <span>Fast Nationwide Shipping | Secure Checkout | 24/7 Support</span>
          </div>

          <div className="hidden text-sm md:block">
            <a href="tel:+923275359491" className="transition-colors duration-300 hover:text-black">
              PK ( +92 3275359491 )
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;
