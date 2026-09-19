import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
  HiChevronDown,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, fetchCart } from "../../redux/slices/CartSlice";
import { logout } from "../../redux/slices/authSlices";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const { user, userId, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  useEffect(() => {
    if (!userId && !guestId) {
      return;
    }
    dispatch(fetchCart({ userId, guestId }));
  }, [dispatch, userId, guestId]);

  const cartItemCount = useMemo(() => {
    if (!Array.isArray(cart?.products)) {
      return 0;
    }
    return cart.products.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );
  }, [cart]);

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };
  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    setAccountDropdownOpen(false);
    setNavDrawerOpen(false);
    navigate("/login");
  };

  const shopItems = [
    { label: "Men", to: "/collections?gender=Men" },
    { label: "Women", to: "/collections?gender=Women" },
    { label: "Top Wear", to: "/collections?category=Top%20Wear" },
    { label: "Bottom Wear", to: "/collections?category=Bottom%20Wear" },
  ];

  return (
    <>
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <div>
          <Link to="/" className="display-title text-3xl font-semibold tracking-tight text-[var(--ink)] transition-colors duration-300 hover:text-[var(--bronze-deep)]">
            E / C
          </Link>
        </div>

        <div className="relative hidden items-center gap-8 md:flex">
          <Link to="/" className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--ink-soft)] transition-colors duration-300 hover:text-[var(--bronze-deep)]">
            Home
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setShopDropdownOpen(true)}
            onMouseLeave={() => setShopDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--ink-soft)] transition-colors duration-300 hover:text-[var(--bronze-deep)]">
              Shop
              <HiChevronDown className={`h-4 w-4 transition-transform duration-300 ${shopDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <div
              className={`absolute left-0 top-8 w-56 overflow-hidden border border-[var(--line)] bg-[var(--surface-elevated)] shadow-xl transition-all duration-300 ${
                shopDropdownOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
              }`}
            >
              {shopItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="block border-b border-[var(--line)] px-4 py-3 text-sm text-[var(--ink-soft)] transition-colors duration-300 last:border-b-0 hover:bg-[var(--paper)] hover:text-[var(--ink)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/collections" className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--ink-soft)] transition-colors duration-300 hover:text-[var(--bronze-deep)]">
            Collections
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="hidden bg-[var(--graphite)] px-3 py-2 text-center text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-[var(--bronze-deep)] lg:inline-block"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="hidden md:block">
            <SearchBar />
          </div>

          <button
            onClick={toggleCartDrawer}
            className="relative text-[var(--ink-soft)] transition-colors duration-300 hover:text-[var(--bronze-deep)]"
            aria-label="Open cart"
          >
            <HiOutlineShoppingBag className="h-6 w-6" />
            <span key={cartItemCount} className="cart-count absolute -right-2 -top-2 rounded-full bg-[var(--graphite)] px-1.5 py-0.5 text-[10px] text-white" aria-label={`${cartItemCount} items in cart`}>
              {cartItemCount}
            </span>
          </button>

          <div className="relative hidden md:block">
            {user ? (
              <>
                <button
                  onClick={() => setAccountDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1 text-[var(--ink-soft)] transition-colors duration-300 hover:text-[var(--bronze-deep)]"
                >
                  <HiOutlineUser className="h-6 w-6" />
                  <HiChevronDown className={`h-4 w-4 transition-transform duration-300 ${accountDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <div
                    className={`absolute right-0 top-9 w-56 overflow-hidden border border-[var(--line)] bg-[var(--surface-elevated)] shadow-xl transition-all duration-300 ${
                    accountDropdownOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
                  }`}
                >
                  <div className="border-b border-[var(--line)] px-4 py-3">
                    <p className="text-sm font-semibold text-[var(--ink)]">{user.name}</p>
                    <p className="truncate text-xs text-[var(--ink-soft)]">{user.email}</p>
                  </div>
                  <Link to="/profile" onClick={() => setAccountDropdownOpen(false)} className="block border-b border-[var(--line)] px-4 py-3 text-sm text-[var(--ink-soft)] transition-colors duration-300 hover:bg-[var(--paper)] hover:text-[var(--ink)]">
                    Profile
                  </Link>
                  <Link to="/my-order" onClick={() => setAccountDropdownOpen(false)} className="block border-b border-[var(--line)] px-4 py-3 text-sm text-[var(--ink-soft)] transition-colors duration-300 hover:bg-[var(--paper)] hover:text-[var(--ink)]">
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-[var(--error)] transition-colors duration-300 hover:bg-[#f7e9e5]"
                  >
                    <HiArrowRightOnRectangle className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="border border-[var(--line)] px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--ink-soft)] transition-colors duration-300 hover:bg-[var(--paper)]">
                  Login
                </Link>
                <Link to="/register" className="bg-[var(--graphite)] px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:bg-[var(--bronze-deep)]">
                  Register
                </Link>
              </div>
            )}
          </div>

          <button onClick={toggleNavDrawer} className="md:hidden" aria-label="Open navigation menu">
            <HiBars3BottomRight className="h-6 w-6 text-[var(--ink-soft)] transition-colors duration-300 hover:text-[var(--bronze-deep)]" />
          </button>
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      <div
        className={`fixed left-0 top-0 z-50 h-full w-3/4 transform bg-[var(--surface-elevated)] shadow-xl transition-transform duration-300 sm:w-1/2 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--line)] p-4">
          <p className="display-title text-2xl">Menu</p>
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-[var(--ink-soft)] transition-colors duration-300 hover:text-[var(--bronze-deep)]" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4 border-b border-[var(--line)] pb-4 md:hidden">
            <SearchBar />
          </div>

          <nav className="space-y-2">
            <Link
              to="/"
              className="block px-3 py-2 text-[var(--ink-soft)] transition-colors duration-300 hover:bg-[var(--paper)] hover:text-[var(--ink)]"
              onClick={toggleNavDrawer}
            >
              Home
            </Link>

            {shopItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="block px-3 py-2 text-[var(--ink-soft)] transition-colors duration-300 hover:bg-[var(--paper)] hover:text-[var(--ink)]"
                onClick={toggleNavDrawer}
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link to="/profile" className="block px-3 py-2 text-[var(--ink-soft)] transition-colors duration-300 hover:bg-[var(--paper)] hover:text-[var(--ink)]" onClick={toggleNavDrawer}>
                  Profile
                </Link>
                <Link to="/my-order" className="block px-3 py-2 text-[var(--ink-soft)] transition-colors duration-300 hover:bg-[var(--paper)] hover:text-[var(--ink)]" onClick={toggleNavDrawer}>
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full bg-[#f7e9e5] px-3 py-2 text-left text-[var(--error)] transition-colors duration-300 hover:bg-[#efd5ce]"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-3">
                <Link to="/login" className="border border-[var(--line)] px-3 py-2 text-center text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--ink-soft)]" onClick={toggleNavDrawer}>
                  Login
                </Link>
                <Link to="/register" className="bg-[var(--graphite)] px-3 py-2 text-center text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white" onClick={toggleNavDrawer}>
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>

      {navDrawerOpen && (
        <button
          onClick={toggleNavDrawer}
          aria-label="Close mobile navigation"
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
        />
      )}
    </>
  );
};

export default Navbar;
