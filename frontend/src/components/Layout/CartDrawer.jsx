import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import CartContent from "../Cart/CartContent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const cartTotal = Number(cart?.totalPrice || 0);
  const itemCount = Array.isArray(cart?.products)
    ? cart.products.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
    : 0;

  const handleCheckout = () => {
    if (itemCount === 0) {
      return;
    }
    toggleCartDrawer();
    navigate("/checkout");
  };

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const drawerUI = (
    <>
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/35 backdrop-blur-md transition-opacity duration-300"
          onClick={toggleCartDrawer}
          aria-hidden="true"
        ></div>
      )}

      <div
        className={`fixed inset-y-0 right-0 z-[100] h-dvh w-full transform bg-[var(--surface)] shadow-2xl transition-transform duration-300 ease-in-out sm:w-3/4 md:w-[28rem] ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-5">
          <h2 className="font-[var(--display)] text-3xl font-semibold text-[var(--ink)]">
            Your edit
          </h2>
          <button
            onClick={toggleCartDrawer}
            className="text-[var(--ink-soft)] transition hover:text-[var(--bronze-deep)]"
            aria-label="Close Cart"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>

        <div className="h-full flex-grow space-y-4 overflow-y-auto bg-[var(--paper)] px-6 py-4 custom-scrollbar">
          <CartContent />
        </div>

        <div className="sticky bottom-0 border-t border-[var(--line)] bg-[var(--surface)] px-6 py-5">
          <div className="mb-3 flex items-center justify-between text-sm text-[var(--ink-soft)]">
            <span>Subtotal ({itemCount} items)</span>
            <span className="font-semibold">Rs {cartTotal.toLocaleString()}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={itemCount === 0}
            className="w-full bg-[var(--ink)] py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[var(--bronze-deep)] disabled:cursor-not-allowed disabled:bg-[#bcb6ad]"
          >
            Proceed to Checkout
          </button>
          <p className="mt-3 text-center text-xs text-[var(--ink-soft)]">
            Shipping & discounts are calculated at checkout.
          </p>
        </div>
      </div>
    </>
  );

  return createPortal(drawerUI, document.body);
};

export default CartDrawer;
