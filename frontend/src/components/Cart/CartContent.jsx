import React from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/CartSlice";
import { toast } from "sonner";

const CartContent = () => {
  const dispatch = useDispatch();
  const { userId, guestId } = useSelector((state) => state.auth);
  const { cart, loading } = useSelector((state) => state.cart);
  const cartItems = Array.isArray(cart?.products) ? cart.products : [];

  const changeQuantity = (product, nextQuantity) => {
    dispatch(
      updateCartItemQuantity({
        productId: product.productId,
        quantity: nextQuantity,
        size: product.size,
        color: product.color,
        guestId,
        userId,
      })
    );
  };

  const handleRemove = (product) => {
    dispatch(
      removeFromCart({
        productId: product.productId,
        size: product.size,
        color: product.color,
        guestId,
        userId,
      })
    ).unwrap().then(() => toast.success("Item removed from cart", { duration: 1200 })).catch(() => toast.error("We couldn't remove that item"));
  };

  if (loading && cartItems.length === 0) {
    return <p className="eyebrow">Loading cart</p>;
  }

  if (cartItems.length === 0) {
    return <div className="border-y border-[var(--line)] py-10 text-center"><p className="display-title text-3xl">Your bag is quiet.</p><p className="mt-2 text-sm text-[var(--ink-soft)]">Add something considered to begin.</p></div>;
  }

  return (
    <>
      {cartItems.map((product, index) => (
        <div
          key={`${product.productId}_${product.size}_${product.color}_${index}`}
          className="flex items-start justify-between gap-4 border-b border-[var(--line)] py-5"
        >
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="mr-4 h-24 w-20 object-cover"
            />
            <div>
              <h3 className="text-sm font-semibold">{product.name}</h3>
              <p className="mt-1 text-xs text-[var(--ink-soft)]">
                {product.size} / {product.color}
              </p>
              <div className="flex items-center mt-2">
                <button
                  onClick={() => changeQuantity(product, Math.max(0, Number(product.quantity || 1) - 1))}
                  aria-label={`Decrease ${product.name} quantity`}
                  className="h-9 w-9 border border-[var(--line)] text-lg hover:bg-[var(--paper)]"
                >
                  -
                </button>
                <span className="mx-3 min-w-4 text-center text-sm" aria-live="polite">{product.quantity}</span>
                <button
                  onClick={() => changeQuantity(product, Number(product.quantity || 1) + 1)}
                  aria-label={`Increase ${product.name} quantity`}
                  className="h-9 w-9 border border-[var(--line)] text-lg hover:bg-[var(--paper)]"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div>
            <p className="whitespace-nowrap text-sm font-semibold">Rs {(Number(product.price || 0) * Number(product.quantity || 0)).toLocaleString()}</p>
            <button onClick={() => handleRemove(product)} aria-label={`Remove ${product.name} from cart`} className="mt-2 text-[var(--error)] hover:text-[var(--ink)]">
              <MdDelete className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default CartContent;
