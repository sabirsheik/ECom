import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlistProduct, fetchRecommendations } from "../../redux/slices/ProductSlice";
import { setUserWishlist } from "../../redux/slices/authSlices";
import { toast } from "sonner";

const ProductSkeleton = () => (
  <div className="animate-pulse"><div className="aspect-[3/4] bg-[#e6e0d7]" /><div className="mt-4 h-4 w-3/4 bg-[#e6e0d7]" /><div className="mt-2 h-3 w-1/3 bg-[#e6e0d7]" /></div>
);
const ProductGrid = ({ products, loading, error, onWishlistToggle }) => {
  const dispatch = useDispatch();
  const [pendingWishlist, setPendingWishlist] = useState(null);
  const { user, guestWishlist, viewedProductIds } = useSelector((state) => state.auth ? { ...state.auth, ...state.product } : {});
  const likedIds = user?.wishlist?.map((id) => id.toString()) || guestWishlist || [];
  const handleWishlistToggle = async (productId) => {
    setPendingWishlist(productId);
    try {
      const payload = await dispatch(toggleWishlistProduct({ productId, isAuthenticated: Boolean(user) })).unwrap();
      if (payload.wishlist) dispatch(setUserWishlist(payload.wishlist));
      dispatch(fetchRecommendations({ user, viewedProductIds }));
      onWishlistToggle?.(productId);
    } catch (err) {
      toast.error(err?.message || "Unable to update wishlist");
    } finally {
      setPendingWishlist(null);
    }
  };
  if (loading) return <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">{Array.from({ length: 8 }).map((_, index) => <ProductSkeleton key={index} />)}</div>;
  if (error) return <div className="border border-[var(--line)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--error)]">{error}</div>;
  if (!Array.isArray(products) || products.length === 0) return <div className="border border-[var(--line)] bg-[var(--surface)] p-16 text-center"><p className="display-title text-3xl">Nothing here yet.</p><p className="mt-3 text-sm text-[var(--ink-soft)]">Try adjusting your filters or search.</p></div>;
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {products.map((product) => {
        const firstImage = product.images?.[0];
        const secondImage = product.images?.[1];
        const isLiked = likedIds.includes(product._id) || likedIds.includes(product._id?.toString());
        const inStock = Number(product.countInPrice || 0) > 0;
        return (
          <article key={product._id} className="group">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#e9e3da]">
              <Link to={`/product/${product._id}`} className="block h-full">
                {firstImage?.url && <img src={firstImage.url} alt={firstImage.alt || product.name} loading="lazy" className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${secondImage?.url ? "group-hover:opacity-0" : "group-hover:scale-[1.03]"}`} />}
                {secondImage?.url && <img src={secondImage.url} alt={secondImage.alt || product.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100" />}
              </Link>
              {!inStock && <span className="absolute left-3 top-3 bg-[var(--surface)] px-2 py-1 text-[0.58rem] font-bold uppercase tracking-wider">Sold out</span>}
              {Number(product.discountPrice || 0) > 0 && <span className="absolute left-3 top-3 bg-[var(--ink)] px-2 py-1 text-[0.58rem] font-bold uppercase tracking-wider text-white">Sale</span>}
              <button onClick={() => handleWishlistToggle(product._id)} disabled={pendingWishlist === product._id} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-[var(--surface)] transition hover:bg-[var(--ink)] hover:text-white" aria-label={isLiked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}>
                <Heart size={16} strokeWidth={1.5} fill={isLiked ? "currentColor" : "none"} />
              </button>
              <Link to={`/product/${product._id}`} className="absolute bottom-3 left-3 right-3 flex translate-y-2 items-center justify-center gap-2 bg-[var(--surface)] py-3 text-[0.62rem] font-bold uppercase tracking-[0.16em] opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">View product <Plus size={14} strokeWidth={1.5} /></Link>
            </div>
            <Link to={`/product/${product._id}`} className="block pt-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate text-sm font-semibold">{product.name}</h3><p className="mt-1 text-xs text-[var(--ink-soft)]">{product.category || "Collection"}</p></div><p className="shrink-0 text-sm font-semibold">Rs {Number(product.price || 0).toLocaleString()}</p></div></Link>
          </article>
        );
      })}
    </div>
  );
};

export default ProductGrid;
