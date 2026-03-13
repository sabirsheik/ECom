import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  rateProduct,
  toggleWishlistProduct,
  fetchRecommendations,
} from "../../redux/slices/ProductSlice";
import { setUserWishlist } from "../../redux/slices/authSlices";
import { toast } from "sonner";

const ProductGrid = ({ products, loading, error, onWishlistToggle }) => {
  const dispatch = useDispatch();
  const [ratings, setRatings] = useState({});
  const { user } = useSelector((state) => state.auth);
  const { guestWishlist, viewedProductIds } = useSelector((state) => state.product);

  const likedIds = user?.wishlist?.map((id) => id.toString()) || guestWishlist;

  // Initialize ratings once products are available
  useEffect(() => {
    if (Array.isArray(products)) {
      const initialRatings = products.reduce((acc, product) => {
        acc[product._id] = Math.round(product.rating) || 0;
        return acc;
      }, {});
      setRatings(initialRatings);
    }
  }, [products]);
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-gray-500 text-lg">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  const handleRatingChange = (productId, newRating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [productId]: newRating,
    }));

    if (!user) {
      toast.error("Please login to submit ratings");
      return;
    }

    dispatch(rateProduct({ productId, rating: newRating }))
      .unwrap()
      .then(() => toast.success("Rating submitted"))
      .catch((err) => toast.error(err?.message || "Failed to submit rating"));
  };

  const handleWishlistToggle = (productId) => {
    const isAuthenticated = Boolean(user);

    dispatch(toggleWishlistProduct({ productId, isAuthenticated }))
      .unwrap()
      .then((payload) => {
        if (payload.wishlist) {
          dispatch(setUserWishlist(payload.wishlist));
        }
        dispatch(fetchRecommendations({ user, viewedProductIds }));
        if (onWishlistToggle) {
          onWishlistToggle(productId);
        }
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to update wishlist");
      });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
      {products.map((product) => {
        // Backend uses countInPrice as stock quantity.
        const hasStock = Number(product.countInPrice || 0) > 0;
        return (
        <div
          key={product._id}
          className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500"
        >
          <div className="w-full h-80 overflow-hidden relative">
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.alt || product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Stock Badge */}
            <span
              className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full ${
                hasStock
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {hasStock ? "In Stock" : "Out of Stock"}
            </span>

            {/* Wishlist Icon */}
            <button
              onClick={() => handleWishlistToggle(product._id)}
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              <FaHeart className={likedIds.includes(product._id) ? "text-red-600" : "text-gray-500"} />
            </button>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-e-hover transition-colors duration-300">
              {product.name}
            </h3>

            {/* Price */}
            <p className="text-gray-700 font-semibold text-base">
              Rs {product.price}
            </p>

            {/* Rating */}
            <div className="flex items-center mt-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <FaStar
                  key={index}
                  className={`h-6 w-6 cursor-pointer transition-colors duration-300 ${
                    index < ratings[product._id]
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => handleRatingChange(product._id, index + 1)}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {Number(product.rating || ratings[product._id] || 0)} / 5 ({Number(product.ratingCount || 0)})
              </span>
            </div>

            {/* View Details Button */}
            <Link
              to={`/product/${product._id}`}
              className="block mt-4 text-center bg-e-black text-white py-2 text-sm font-medium hover:bg-e-hover transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
            >
              View Details
            </Link>
          </div>
        </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
