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
        className={`fixed inset-y-0 right-0 z-[100] h-dvh w-full transform rounded-l-xl bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-3/4 md:w-[28rem] ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white rounded-tl-xl">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            Your Shopping Cart
          </h2>
          <button
            onClick={toggleCartDrawer}
            className="text-gray-600 hover:text-red-500 transition"
            aria-label="Close Cart"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar bg-gray-50 h-full">
          <CartContent />
        </div>

        <div className="px-6 py-4 bg-white border-t sticky bottom-0">
          <div className="flex items-center justify-between mb-3 text-sm text-gray-700">
            <span>Subtotal ({itemCount} items)</span>
            <span className="font-semibold">Rs {cartTotal.toLocaleString()}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={itemCount === 0}
            className="w-full bg-black text-white py-3 rounded-lg text-base font-semibold hover:bg-gray-900 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
          </button>
          <p className="text-xs text-gray-600 mt-2 text-center">
            Shipping & discounts are calculated at checkout.
          </p>
        </div>
      </div>
    </>
  );

  return createPortal(drawerUI, document.body);
};

export default CartDrawer;
