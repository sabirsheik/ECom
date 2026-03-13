import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  createCheckout,
  createStripeSession,
  fetchCheckoutStatus,
  verifyStripeSession,
} from "../../redux/slices/CheckOutSlice";
import { clearCart, fetchCart } from "../../redux/slices/CartSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { user, userId, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { loading } = useSelector((state) => state.checkout);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const cartItems = useMemo(
    () => (Array.isArray(cart?.products) ? cart.products : []),
    [cart?.products]
  );
  const totalPrice = Number(cart?.totalPrice || 0);

  const checkoutItems = useMemo(
    () =>
      cartItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 0),
        size: item.size,
        color: item.color,
      })),
    [cartItems]
  );

  useEffect(() => {
    const payment = searchParams.get("payment");
    const checkoutId = searchParams.get("checkoutId");
    const sessionId = searchParams.get("session_id");

    if (payment === "failed") {
      toast.error("Stripe payment cancelled or failed.");
      setSearchParams({}, { replace: true });
      return;
    }

    if (payment === "success" && checkoutId && sessionId) {
      const verifyPayment = async () => {
        try {
          await dispatch(verifyStripeSession({ checkoutId, sessionId })).unwrap();
          dispatch(clearCart());
          if (userId || guestId) {
            dispatch(fetchCart({ userId, guestId }));
          }
          toast.success("Payment verified and order placed successfully");
          setSearchParams({}, { replace: true });
          navigate("/order-confirmation");
        } catch (error) {
          const maxAttempts = 4;
          for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
            const waitMs = 1200;
            await new Promise((resolve) => setTimeout(resolve, waitMs));
            try {
              const status = await dispatch(fetchCheckoutStatus(checkoutId)).unwrap();
              if (status.isFinalized) {
                dispatch(clearCart());
                if (userId || guestId) {
                  dispatch(fetchCart({ userId, guestId }));
                }
                toast.success("Order confirmed");
                setSearchParams({}, { replace: true });
                navigate("/order-confirmation");
                return;
              }
            } catch {
              // Ignore polling errors; final message shown after retries.
            }
          }

          toast.error(error?.message || "Payment confirmation is delayed. Please check My Orders shortly.");
          setSearchParams({}, { replace: true });
        }
      };

      verifyPayment();
    }
  }, [dispatch, guestId, navigate, searchParams, setSearchParams, userId]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();

    if (checkoutItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      const payload = {
        checkoutItems,
        shippingAddress: {
          address: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: Number(shippingAddress.postalCode),
          country: shippingAddress.country,
        },
        paymentMethod,
        totalPrice,
      };

      const checkoutResponse = await dispatch(
        createCheckout({
          ...payload,
        })
      ).unwrap();

      if (paymentMethod === "COD") {
        dispatch(clearCart());
        if (userId || guestId) {
          dispatch(fetchCart({ userId, guestId }));
        }
        toast.success("Order placed with Cash on Delivery");
        navigate("/order-confirmation");
        return;
      }

      const checkoutId = checkoutResponse?.checkout?._id;
      if (!checkoutId) {
        toast.error("Checkout created but Stripe session could not start.");
        return;
      }

      const stripeSession = await dispatch(createStripeSession(checkoutId)).unwrap();

      if (!stripeSession?.url) {
        toast.error("Stripe session URL missing.");
        return;
      }

      window.location.href = stripeSession.url;
    } catch (error) {
      toast.error(error?.message || "Failed to create checkout");
    }
  };

  return (
    <>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 tracking-tight lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl uppercase">Checkout</h2>
          <form onSubmit={handleCreateCheckout}>
            <h3 className="text-lg mb-4">Contact Details</h3>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={user?.email || ""}
                className="w-full p-2 border rounded cursor-not-allowed"
                disabled
                id="email"
              />
            </div>
            <h3 className="text-lg mb-4">Delivery</h3>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  value={shippingAddress.firstName}
                  onChange={(e) => {
                    setShippingAddress({
                      ...shippingAddress,
                      firstName: e.target.value,
                    });
                  }}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  value={shippingAddress.lastName}
                  onChange={(e) => {
                    setShippingAddress({
                      ...shippingAddress,
                      lastName: e.target.value,
                    });
                  }}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
                <label htmlFor="address" className="block text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  value={shippingAddress.address}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      address: e.target.value,
                    })
                }
                className="w-full p-2 border rounded"
                required
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => {
                    setShippingAddress({
                      ...shippingAddress,
                      city: e.target.value,
                    });
                  }}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-gray-700">
                Postal Code
                </label>
                <input
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) => {
                    setShippingAddress({
                      ...shippingAddress,
                      postalCode: e.target.value,
                    });
                  }}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
              <div className="mb-4">
                <label htmlFor="country" className="block text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  value={shippingAddress.country}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      country: e.target.value,
                    })
                }
                className="w-full p-2 border rounded"
                required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      phone: e.target.value,
                    })
                }
                className="w-full p-2 border rounded"
                required
                />
              </div>

            <div className="mb-4">
              <p className="mb-2 block text-gray-700">Payment Method</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className={`cursor-pointer rounded border p-3 transition ${paymentMethod === "COD" ? "border-slate-900 bg-slate-50" : "border-slate-300"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  Cash on Delivery
                </label>
                <label className={`cursor-pointer rounded border p-3 transition ${paymentMethod === "STRIPE" ? "border-slate-900 bg-slate-50" : "border-slate-300"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="STRIPE"
                    checked={paymentMethod === "STRIPE"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  Pay with Stripe
                </label>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="w-full rounded bg-e-black py-3 text-white transition-colors duration-300 hover:bg-e-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Processing..."
                  : paymentMethod === "STRIPE"
                    ? "Continue to Stripe"
                    : "Place COD Order"}
              </button>
              </div>
          </form>
        </div>
        <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="text-lg mb-4">Order Summary</h3>
            <div className="border-t py-4 mb-4">
              {cartItems.map((product, index) =>
                (
                    <div key={index} className="flex items-start justify-between py-2 border-b">
                        <div className="flex items-center">
                            <img src={product.image} alt={product.name}
                            className="w-20 h-2/4 object-cover mr-4"
                            />
                            <div>
                                <h3 className="text-md">{product.name}</h3>
                                <p className="text-gray-500">Size : {product.size}</p>
                                <p className="text-gray-500">Color : {product.color}</p>
                              <p className="text-gray-500">Qty : {product.quantity}</p>
                            </div>
                        </div>
                            <p className="text-xl">Rs{(Number(product.price || 0) * Number(product.quantity || 0)).toLocaleString()}</p>
                    </div>
                )
                )}
            </div>
            <div className="flex justify-between items-center text-lg mb-4">
                <p>Subtotal</p>
                <p>Rs {totalPrice.toLocaleString()}</p>
            </div>
            <div className="flex justify-between items-center text-lg">
                <p>Shipping</p>
                <p>Free</p>
            </div>
            <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
                <p>Total</p>
                <p>Rs {totalPrice.toLocaleString()}</p>
            </div>
        </div>
      </div>
    </>
  );
};
export default Checkout;
