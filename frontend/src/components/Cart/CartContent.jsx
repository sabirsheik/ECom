import React from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/CartSlice";

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
    );
  };

  if (loading && cartItems.length === 0) {
    return <p className="text-sm text-gray-500">Loading cart...</p>;
  }

  if (cartItems.length === 0) {
    return <p className="text-sm text-gray-500">Your cart is empty.</p>;
  }

  return (
    <>
      {cartItems.map((product, index) => (
        <div
          key={`${product.productId}_${product.size}_${product.color}_${index}`}
          className="flex items-center justify-between py-4 border-b"
        >
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover mr-4 rounded"
            />
            <div>
              <h3>{product.name}</h3>
              <p className="text-sm text-e-hover ">
                size : {product.size} | color : {product.color}
              </p>
              <div className="flex items-center mt-2">
                <button
                  onClick={() => changeQuantity(product, Math.max(0, Number(product.quantity || 1) - 1))}
                  className="border rounded px-2 py-[2px] text-xl font-medium hover:bg-[#ff1414] hover:text-white"
                >
                  -
                </button>
                <span className="mx-4">{product.quantity}</span>
                <button
                  onClick={() => changeQuantity(product, Number(product.quantity || 1) + 1)}
                  className="border rounded px-2 py-[2px] text-xl font-medium hover:bg-e-hover hover:text-white"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div>
            <p>Rs {(Number(product.price || 0) * Number(product.quantity || 0)).toLocaleString()}</p>
            <button onClick={() => handleRemove(product)}>
              <MdDelete className="h-6 w-6 mt-2 text-red-500 hover:text-[#ff1414]" />
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default CartContent;
