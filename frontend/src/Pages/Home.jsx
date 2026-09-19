import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchRecommendations } from "../redux/slices/ProductSlice";

const ProductRail = ({ eyebrow, title, products }) => {
  if (!products.length) return null;
  return (
    <section className="border-t border-[var(--line)] py-16 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-9 flex items-end justify-between">
          <div><p className="eyebrow mb-3">{eyebrow}</p><h2 className="display-title text-4xl sm:text-5xl">{title}</h2></div>
          <Link to="/collections" className="editorial-link hidden sm:inline-flex">View all <ArrowRight size={15} strokeWidth={1.5} /></Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {products.map((product, index) => {
            const image = product.images?.[0];
            return <Link key={product._id} to={`/product/${product._id}`} className="group reveal-up" style={{ animationDelay: `${index * 70}ms` }}><div className="relative aspect-[3/4] overflow-hidden bg-[#ebe6de]">{image?.url && <img src={image.url} alt={image.alt || product.name} loading={index > 1 ? "lazy" : "eager"} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />}{Number(product.discountPrice || 0) > 0 && <span className="absolute left-3 top-3 bg-[var(--surface)] px-2 py-1 text-[0.58rem] font-bold uppercase tracking-wider">Sale</span>}</div><div className="flex items-start justify-between gap-3 pt-4"><div className="min-w-0"><p className="truncate text-sm font-semibold">{product.name}</p><p className="mt-1 text-xs text-[var(--ink-soft)]">{product.category || "Collection"}</p></div><p className="shrink-0 text-sm font-semibold">Rs {Number(product.price || 0).toLocaleString()}</p></div></Link>;
          })}
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const { recommendations, viewedProductIds } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`),
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/product-newarrivals`),
    ]).then(([all, arrivals]) => {
      setProducts(Array.isArray(all.data) ? all.data : []);
      setNewArrivals(Array.isArray(arrivals.data) ? arrivals.data : []);
    }).catch(() => {
      setProducts([]);
      setNewArrivals([]);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { dispatch(fetchRecommendations({ user, viewedProductIds })); }, [dispatch, user, viewedProductIds]);

  const saleProducts = useMemo(() => products.filter((product) => Number(product.discountPrice || 0) > 0).slice(0, 4), [products]);
  const heroProduct = products[0];
  const heroImage = heroProduct?.images?.[0];
  const recommendationProducts = Array.isArray(recommendations) ? recommendations.slice(0, 4) : [];

  if (loading) return <main className="storefront-shell"><div className="mx-auto max-w-[1440px] px-5 py-32 sm:px-8 lg:px-12"><div className="h-[60vh] animate-pulse bg-[#e9e3da]" /></div></main>;

  return (
    <main className="storefront-shell">
      <section className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-[1440px] items-stretch gap-8 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-12 lg:pb-24 lg:pt-12">
        <div className="flex flex-col justify-center py-10 lg:py-20"><p className="eyebrow reveal-up">The current edit</p><h1 className="display-title reveal-up mt-5 max-w-xl text-6xl leading-[0.88] sm:text-8xl" style={{ animationDelay: "80ms" }}>Everyday pieces, considered.</h1><p className="reveal-up mt-7 max-w-md text-sm leading-7 text-[var(--ink-soft)] sm:text-base" style={{ animationDelay: "150ms" }}>A focused wardrobe of modern essentials, selected for movement, texture, and the way you actually live.</p><div className="reveal-up mt-9 flex items-center gap-7" style={{ animationDelay: "220ms" }}><Link to="/collections" className="inline-flex items-center gap-3 bg-[var(--ink)] px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[var(--bronze-deep)]">Shop the collection <ArrowRight size={16} strokeWidth={1.5} /></Link><Link to="/collections?gender=Women" className="editorial-link">Women <ChevronRight size={15} strokeWidth={1.5} /></Link></div>{heroProduct && <p className="mt-16 text-xs text-[var(--ink-soft)]">Featured now <span className="mx-2 text-[var(--bronze)]">/</span> {heroProduct.name}</p>}</div>
        <div className="relative min-h-[55vh] overflow-hidden bg-[#e7e1d8] lg:min-h-0">{heroImage?.url && <img src={heroImage.url} alt={heroImage.alt || heroProduct.name} className="h-full w-full object-cover object-center transition duration-[1400ms] hover:scale-[1.02]" />}<div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white sm:bottom-8 sm:left-8 sm:right-8"><span className="text-[0.62rem] font-bold uppercase tracking-[0.2em]">E-Commerce Studio</span><span className="text-[0.62rem] uppercase tracking-[0.2em]">01 / 01</span></div></div>
      </section>
      <div className="border-y border-[var(--line)] bg-[var(--surface)]"><div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-[var(--line)] px-5 sm:grid-cols-4 sm:px-8 lg:px-12"><Link to="/collections?gender=Men" className="py-5 text-center text-[0.62rem] font-bold uppercase tracking-[0.16em]">Men</Link><Link to="/collections?gender=Women" className="py-5 text-center text-[0.62rem] font-bold uppercase tracking-[0.16em]">Women</Link><Link to="/collections?category=Top%20Wear" className="hidden py-5 text-center text-[0.62rem] font-bold uppercase tracking-[0.16em] sm:block">Top wear</Link><Link to="/collections?category=Bottom%20Wear" className="hidden py-5 text-center text-[0.62rem] font-bold uppercase tracking-[0.16em] sm:block">Bottom wear</Link><Link to="/collections" className="col-span-2 py-5 text-center text-[0.62rem] font-bold uppercase tracking-[0.16em] sm:hidden">View all collections</Link></div></div>
      <ProductRail eyebrow="New in" title="The latest pieces" products={newArrivals.slice(0, 4)} />
      <ProductRail eyebrow="Selected reduction" title="Worth a closer look" products={saleProducts} />
      <ProductRail eyebrow="For your wardrobe" title="You may also like" products={recommendationProducts} />
    </main>
  );
};

export default Home;
