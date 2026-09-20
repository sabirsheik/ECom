import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "../../redux/slices/ProductSlice";
import { addToCart } from "../../redux/slices/CartSlice";
import { trackProductView } from "../../redux/slices/ProductSlice";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { toggleWishlistProduct, fetchSimilarProducts } from "../../redux/slices/ProductSlice";
import { setUserWishlist } from "../../redux/slices/authSlices";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, similarProducts } = useSelector(
    (state) => state.product
  );
  const { userId, guestId } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);
  const { guestWishlist } = useSelector((state) => state.product);
  const { addToCartLoading } = useSelector((state) => state.cart);
  const [mainImg, setMainImg] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const [selectedColor, setSelectedColor] = useState();
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [wishlistPending, setWishlistPending] = useState(false);
  const productFetchId = productId || id;
  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(trackProductView({ productId: productFetchId }));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);
  const handleQuantityChange = (action) => {
    action === "plus"
      ? setQuantity(quantity + 1)
      : quantity > 1 && setQuantity(quantity - 1);
  };

  const handleWishlistToggle = async () => {
    if (!selectedProduct?._id) return;
    setWishlistPending(true);
    try {
      const payload = await dispatch(toggleWishlistProduct({
        productId: selectedProduct._id,
        isAuthenticated: Boolean(user),
      })).unwrap();
      if (payload.wishlist) dispatch(setUserWishlist(payload.wishlist));
      toast.success(isWishlisted ? "Removed from wishlist" : "Saved to wishlist", { duration: 1200 });
    } catch (error) {
      toast.error(error?.message || "Unable to update wishlist");
    } finally {
      setWishlistPending(false);
    }
  };

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImg(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleAddToCart = async () => {
    if (!selectedProduct?._id) {
      toast.error("Product details are not ready yet.", {
        duration: 1200,
      });
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      toast.error("Please select a valid quantity.", {
        duration: 1200,
      });
      return;
    }

    const stock = Number(selectedProduct.countInPrice || 0);
    if (stock < 1) {
      toast.error("This product is out of stock.", {
        duration: 1200,
      });
      return;
    }

    if (!selectedProduct.isPublished) {
      toast.error("This product is currently unavailable.", {
        duration: 1200,
      });
      return;
    }

    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color before adding to cart.", {
        duration: 1000,
      });
      return;
    }

    try {
      await dispatch(
        addToCart({
          productId: selectedProduct._id,
          quantity,
          size: selectedSize,
          color: selectedColor,
          guestId,
          userId,
        })
      ).unwrap();

      toast.success("Product added to cart successfully!", {
        duration: 1000,
      });
    } catch (err) {
      toast.error(err?.message || "Failed to add product to cart", {
        duration: 1400,
      });
    }
  };

  if (loading || !selectedProduct) {
    return (
      <div className="flex h-64 items-center justify-center bg-[var(--paper)]">
        <p className="eyebrow">Loading product</p>
      </div>
    );
  }

  const images = selectedProduct.images || [];
  const activeImageIndex = Math.max(0, images.findIndex((image) => image.url === mainImg));
  const isWishlisted = user?.wishlist?.map((id) => id.toString()).includes(selectedProduct._id?.toString())
    || guestWishlist?.includes(selectedProduct._id);
  const stock = Number(selectedProduct.countInPrice || 0);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1440px] border-y border-[var(--line)] bg-[var(--surface)] p-5 sm:p-8 lg:p-12">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Thumbnails */}
          <div className="hidden md:flex flex-col space-y-4">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setMainImg(img.url)}
                className={`h-20 w-20 overflow-hidden border transition ${
                  mainImg === img.url ? "border-[var(--ink)]" : "border-transparent opacity-70 hover:opacity-100"
                }`}
                aria-label={`View image ${index + 1}`}
              ><img src={img.url} alt="" className="h-full w-full object-cover" /></button>
            ))}
          </div>

          {/* Main Image with Zoom */}
          <div className="md:w-1/2">
            <div className="relative overflow-hidden bg-[var(--graphite)] shadow-[var(--shadow)] group">
              <div
                className="relative overflow-hidden h-[400px]  md:h-[700px]"
                style={{ width: "100%", cursor: "zoom-in" }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  e.currentTarget.firstChild.style.transformOrigin = `${x}% ${y}%`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.firstChild.style.transformOrigin = `center center`;
                }}
              >
                <img
                  src={mainImg}
                  alt={images[activeImageIndex]?.alt || selectedProduct.name}
                  className="h-full w-full object-cover transition-transform duration-300"
                  style={{
                    transform: `scale(${zoom})`,
                  }}
                />
              </div>

              {/* Zoom Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex gap-2 bg-[var(--surface)] p-2 shadow-md">
                <button aria-label="Previous product image" onClick={() => setMainImg(images[(activeImageIndex - 1 + images.length) % images.length]?.url)} className="flex h-10 w-10 items-center justify-center hover:bg-[var(--paper)]"><ChevronLeft size={18} /></button>
                <button aria-label="Next product image" onClick={() => setMainImg(images[(activeImageIndex + 1) % images.length]?.url)} className="flex h-10 w-10 items-center justify-center hover:bg-[var(--paper)]"><ChevronRight size={18} /></button>
                </div>
                <div className="flex gap-2 bg-[var(--surface)] p-2 shadow-md">
                <button
                  aria-label="Zoom in"
                  onClick={() => setZoom((prev) => Math.min(prev + 0.2, 3))}
                  className="flex h-10 w-10 items-center justify-center bg-[var(--surface)] text-xl font-bold hover:bg-[var(--bronze)]"
                >
                  +
                </button>
                <button
                  aria-label="Zoom out"
                  onClick={() => setZoom((prev) => Math.max(prev - 0.2, 1))}
                  className="flex h-10 w-10 items-center justify-center bg-[var(--surface)] text-xl font-bold hover:bg-[var(--bronze)]"
                >
                  -
                </button>
                </div>
              </div>
            </div>

            {/* Mobile Thumbnails */}
            <div className="flex md:hidden overflow-x-auto space-x-4 mt-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  src={img.url}
                  onClick={() => setMainImg(img.url)}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden border ${
                    mainImg === img.url ? "border-[var(--ink)]" : "border-transparent opacity-70"
                  }`}
                  aria-label={`View image ${index + 1}`}
                ><img src={img.url} alt="" className="h-full w-full object-cover" /></button>
              ))}
            </div>
          </div>

          {/* Right Side Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
            <h1 className="display-title mb-4 text-4xl font-semibold text-[var(--ink)] sm:text-5xl">
              {selectedProduct.name}
            </h1>
            <button onClick={handleWishlistToggle} disabled={wishlistPending} aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"} className={`flex h-11 w-11 shrink-0 items-center justify-center border transition hover:bg-[var(--ink)] hover:text-white ${isWishlisted ? "bg-[var(--ink)] text-white" : "border-[var(--line)]"}`}><Heart size={19} fill={isWishlisted ? "currentColor" : "none"} /></button>
            </div>

            <div className="flex items-center gap-4 mb-2">
              {selectedProduct.originalPrice && (
                <p className="text-lg text-[var(--ink-soft)] line-through">
                  Rs {selectedProduct.originalPrice}
                </p>
              )}
              <p className="text-3xl font-semibold text-[var(--ink)]">
                Rs {Number(selectedProduct.price || 0).toLocaleString()}
              </p>
            </div>

            <p className="mb-8 text-sm leading-7 text-[var(--ink-soft)]">{selectedProduct.description}</p>
            <p className={`mb-6 text-sm font-semibold ${stock > 0 ? "text-[var(--success)]" : "text-[var(--error)]"}`}>{stock > 0 ? `${stock} available` : "Currently unavailable"}</p>

            {/* Colors */}
            <div className="mb-8">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--ink)]">
                Select Color:
              </p>
              <div className="flex flex-wrap gap-4">
                {selectedProduct.colors.map((color) => {
                  const isSelected = selectedColor === color;

                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative flex items-center gap-2 border px-4 py-3 text-sm font-medium transition
            ${
              isSelected
                ? "border-[var(--bronze)] bg-[var(--paper)] ring-2 ring-[var(--bronze)]"
                : "border-[var(--line)] bg-[var(--surface-elevated)]"
            }
          `}
                    >
                      <span
                        className="h-5 w-5 rounded-full border border-[var(--line)]"
                        style={{ backgroundColor: color.toLowerCase() }}
                      ></span>
                      <span className="capitalize text-[var(--ink)]">{color}</span>

                      {isSelected && (
                        <svg
                          className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-[var(--surface-elevated)] p-[1px] text-[var(--ink)] shadow"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em]">Select Size:</p>
              <div className="flex gap-3 flex-wrap">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border px-5 py-3 ${
                      selectedSize === size
                        ? "bg-e-black text-white"
                        : "border-[var(--line)] text-[var(--ink-soft)]"
                      } hover:bg-[var(--bronze-deep)] hover:text-white transition-colors duration-300`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em]">Quantity:</p>
              <div className="flex items-center gap-5">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  aria-label="Decrease quantity"
                  className="flex h-11 w-11 items-center justify-center border border-[var(--line)] hover:bg-[var(--paper)]"
                >
                  -
                </button>
                <span className="min-w-8 text-center text-lg font-semibold" aria-live="polite">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("plus")}
                  aria-label="Increase quantity"
                  className="flex h-11 w-11 items-center justify-center border border-[var(--line)] hover:bg-[var(--paper)]"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={addToCartLoading}
              className={`w-full py-4 text-sm font-bold uppercase tracking-[0.14em] text-white transition ${
                addToCartLoading
                  ? "cursor-not-allowed bg-[#aaa59c]"
                  : "bg-[var(--graphite)] hover:bg-[var(--bronze-deep)]"
              }`}
            >
              {addToCartLoading ? "Adding..." : "Add to Cart"}
            </button>

            {/* Characteristics */}
            <div className="mt-10">
              <h3 className="display-title mb-4 text-3xl">
                Characteristics
              </h3>
              <table className="w-full text-left text-sm text-[var(--ink-soft)]">
                <tbody>
                  <tr className="border-b border-[var(--line)]">
                    <td className="py-2 font-semibold">Brand</td>
                    <td className="py-2">{selectedProduct.brand}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Material</td>
                    <td className="py-2">{selectedProduct.meterial}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        <div className="mt-20">
          <h2 className="display-title mb-6 text-center text-4xl">
            You May Also Like
          </h2>
          <ProductGrid products={similarProducts} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
