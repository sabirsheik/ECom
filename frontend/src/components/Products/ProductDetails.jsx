import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "../../redux/slices/ProductSlice";
import { addToCart } from "../../redux/slices/CartSlice";
import { trackProductView } from "../../redux/slices/ProductSlice";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, similarProducts } = useSelector(
    (state) => state.product
  );
  const { userId, guestId } = useSelector((state) => state.auth);
  const { addToCartLoading } = useSelector((state) => state.cart);
  const [mainImg, setMainImg] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const [selectedColor, setSelectedColor] = useState();
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(1);
  const productFetchId = productId || id;
  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(trackProductView({ productId: productFetchId }));
    }
  }, [dispatch, productFetchId]);
  const handleQuantityChange = (action) => {
    action === "plus"
      ? setQuantity(quantity + 1)
      : quantity > 1 && setQuantity(quantity - 1);
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
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-10">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Thumbnails */}
          <div className="hidden md:flex flex-col space-y-4">
            {selectedProduct.images.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={img.alt || `Thumbnail ${index}`}
                onClick={() => setMainImg(img.url)}
                className={`w-20 h-20 object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300 ${
                  mainImg === img.url ? "ring-2 ring-e-black" : ""
                }`}
              />
            ))}
          </div>

          {/* Main Image with Zoom */}
          <div className="md:w-1/2">
            <div className="overflow-hidden rounded-2xl shadow-lg relative group">
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
                  alt={selectedProduct.images[0]?.alt}
                  className="w-full h-[700px] object-fill transition-transform duration-300"
                  style={{
                    transform: `scale(${zoom})`,
                  }}
                />
              </div>

              {/* Zoom Controls */}
              <div className="absolute bottom-4 right-4 flex gap-2 bg-white p-2 rounded-lg shadow-md">
                <button
                  onClick={() => setZoom((prev) => Math.min(prev + 0.2, 3))}
                  className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-xl font-bold"
                >
                  +
                </button>
                <button
                  onClick={() => setZoom((prev) => Math.max(prev - 0.2, 1))}
                  className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-xl font-bold"
                >
                  -
                </button>
              </div>
            </div>

            {/* Mobile Thumbnails */}
            <div className="flex md:hidden overflow-x-auto space-x-4 mt-4">
              {selectedProduct.images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={img.alt || `Thumbnail ${index}`}
                  onClick={() => setMainImg(img.url)}
                  className={`w-20 h-20 flex-shrink-0 object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300 ${
                    mainImg === img.url ? "ring-2 ring-e-black" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Side Details */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              {selectedProduct.name}
            </h1>

            <div className="flex items-center gap-4 mb-2">
              {selectedProduct.originalPrice && (
                <p className="text-gray-400 line-through text-lg">
                  Rs {selectedProduct.originalPrice}
                </p>
              )}
              <p className="text-2xl text-e-black font-semibold">
                Rs {selectedProduct.price}
              </p>
            </div>

            <p className="text-gray-600 mb-6">{selectedProduct.description}</p>

            {/* Colors */}
            <div className="mb-8">
              <p className="text-gray-800 font-semibold text-lg mb-4">
                Select Color:
              </p>
              <div className="flex flex-wrap gap-4">
                {selectedProduct.colors.map((color) => {
                  const isSelected = selectedColor === color;

                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105
            ${
              isSelected
                ? "border-black ring-2 ring-black bg-gray-50"
                : "border-gray-300 bg-white"
            }
          `}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.toLowerCase() }}
                      ></span>
                      <span className="capitalize text-gray-800">{color}</span>

                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-e-black absolute -top-1 -right-1 bg-white rounded-full shadow p-[1px]"
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
              <p className="text-gray-800 font-medium mb-2">Select Size:</p>
              <div className="flex gap-3 flex-wrap">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2 rounded-xl border ${
                      selectedSize === size
                        ? "bg-e-black text-white"
                        : "border-gray-300 text-gray-700"
                    } hover:bg-e-hover hover:text-white transition-colors duration-300`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-gray-800 font-medium mb-2">Quantity:</p>
              <div className="flex items-center gap-5">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  className="w-10 h-10 bg-gray-200 text-2xl rounded-full hover:bg-gray-300 transition"
                >
                  -
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="w-10 h-10 bg-gray-200 text-2xl rounded-full hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={addToCartLoading}
              className={`w-full py-3 rounded-xl text-lg font-bold text-white transition-all duration-300 ${
                addToCartLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-e-black hover:bg-e-hover"
              }`}
            >
              {addToCartLoading ? "Adding..." : "Add to Cart"}
            </button>

            {/* Characteristics */}
            <div className="mt-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Characteristics
              </h3>
              <table className="w-full text-sm text-left text-gray-600">
                <tbody>
                  <tr className="border-b">
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
          <h2 className="text-3xl text-center font-bold text-gray-900 mb-6">
            You May Also Like
          </h2>
          <ProductGrid products={similarProducts} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
