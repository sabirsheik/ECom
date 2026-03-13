import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendations } from "../redux/slices/ProductSlice";
import axios from "axios";
import { motion } from "framer-motion";
import { FaBolt, FaBookmark, FaEye, FaHeart, FaStar, FaTag } from "react-icons/fa";

const MotionDiv = motion.div;
const MotionSpan = motion.span;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUpCard = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const SaleProductsSection = ({ products = [] }) => {
  return (
    <section className="bg-gradient-to-b from-rose-50 via-orange-50 to-amber-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
            <FaTag className="text-rose-500" />
            Limited Deals
          </p>
          <h2 className="text-4xl font-semibold uppercase tracking-wide text-slate-900">Sale Products</h2>
          <p className="mt-2 text-sm text-slate-600">Freshly updated from live database</p>
        </div>

        <MotionDiv
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6"
        >
          {products.map((product) => (
            <MotionDiv key={product._id} variants={fadeUpCard}>
              <Link
                to={`/product/${product._id}`}
                className="group block rounded-2xl bg-white p-3 shadow-sm ring-1 ring-orange-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:ring-orange-400"
              >
                <div className="relative mb-3 overflow-hidden rounded-xl">
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.images?.[0]?.altText || product.name}
                    className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute left-2 top-2 rounded-full bg-rose-600 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Sale
                  </span>
                </div>

                <p className="truncate text-xs text-slate-500">{product.category}</p>
                <h3 className="truncate text-sm font-medium text-slate-800">{product.name}</h3>

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-2xl font-extrabold text-rose-700">Rs {Number(product.price || 0).toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <FaStar />
                    <span>{Number(product.rating || 0).toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            </MotionDiv>
          ))}
        </MotionDiv>
      </div>
    </section>
  );
};

const NewArrivalsSection = ({ products = [] }) => {
  return (
    <section className="bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-semibold uppercase tracking-wide text-slate-900">New Arrivals</h2>
          <p className="mt-2 text-sm text-slate-600">Latest products synced from backend</p>
        </div>

        <MotionDiv
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6"
        >
          {products.map((product) => (
            <MotionDiv key={product._id} variants={fadeUpCard}>
              <Link
                to={`/product/${product._id}`}
                className="group block overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_18px_40px_-16px_rgba(79,70,229,0.5)]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.images?.[0]?.altText || product.name}
                    className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute left-2 top-2 rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    New
                  </span>
                </div>

                <div className="p-3">
                  <h3 className="truncate text-sm font-semibold text-slate-800">{product.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{product.category}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xl font-bold text-indigo-700">Rs {Number(product.price || 0).toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-xs text-indigo-500">
                      <FaBolt />
                      <span>{Number(product.rating || 0).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </MotionDiv>
          ))}
        </MotionDiv>
      </div>
    </section>
  );
};

const RecommendationSection = ({ products = [] }) => {
  return (
    <section className="bg-gradient-to-b from-slate-100 via-emerald-50 to-slate-100 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-semibold uppercase tracking-wide text-slate-900">You May Also Like</h2>
          <p className="mt-2 text-sm text-slate-600">Real-time recommendations from likes, views and purchases</p>
        </div>

        <MotionDiv
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6"
        >
          {products.map((product) => (
            <MotionDiv key={product._id} variants={fadeUpCard} whileHover={{ x: 4 }}>
              <Link
                to={`/product/${product._id}`}
                className="group block rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-[0_12px_24px_-18px_rgba(15,23,42,0.75)] transition-all duration-300 hover:border-emerald-200 hover:shadow-[0_20px_40px_-20px_rgba(16,185,129,0.55)]"
              >
                <div className="relative mb-3 overflow-hidden rounded-xl">
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.images?.[0]?.altText || product.name}
                    className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute right-2 top-2 flex gap-1">
                    <MotionSpan whileHover={{ scale: 1.15 }} className="rounded-full bg-white/95 p-1.5 text-xs text-rose-500 shadow">
                      <FaHeart />
                    </MotionSpan>
                    <MotionSpan whileHover={{ scale: 1.15 }} className="rounded-full bg-white/95 p-1.5 text-xs text-slate-500 shadow">
                      <FaBookmark />
                    </MotionSpan>
                    <MotionSpan whileHover={{ scale: 1.15 }} className="rounded-full bg-white/95 p-1.5 text-xs text-emerald-600 shadow">
                      <FaEye />
                    </MotionSpan>
                  </div>
                </div>

                <p className="truncate text-xs text-slate-500">{product.category}</p>
                <h3 className="truncate text-sm font-medium text-slate-800">{product.name}</h3>

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-lg font-bold text-slate-900">Rs {Number(product.price || 0).toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-xs text-amber-500">
                    <FaStar />
                    <span>{Number(product.rating || 0).toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            </MotionDiv>
          ))}
        </MotionDiv>
      </div>
    </section>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const { recommendations, viewedProductIds } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const [allProducts, setAllProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  const saleProducts = useMemo(
    () => [...allProducts].filter((item) => Number(item.discountPrice || 0) > 0).slice(0, 6),
    [allProducts]
  );

  const likeProducts = useMemo(
    () => (Array.isArray(recommendations) ? recommendations.slice(0, 6) : []),
    [recommendations]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, arrivalsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/product-newarrivals`),
        ]);

        setAllProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
        setNewArrivals(Array.isArray(arrivalsRes.data) ? arrivalsRes.data : []);
      } catch {
        setAllProducts([]);
        setNewArrivals([]);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    dispatch(fetchRecommendations({ user, viewedProductIds }));
  }, [dispatch, user, viewedProductIds]);

  return (
    <div className="bg-gray-100">
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-xl uppercase tracking-widest text-gray-500 mb-2">Fashion 2026</p>
            <h1 className="text-6xl font-semibold text-gray-900 mb-4">SALE UP TO 50% OFF</h1>
            <p className="text-sm text-gray-500 max-w-md mb-6">
              Premium clothing collections for men and women with everyday comfort and modern cuts.
            </p>
            <Link to="/collections" className="inline-block border border-gray-900 px-8 py-3 text-sm uppercase tracking-wide hover:bg-gray-900 hover:text-white transition-colors">
              Shop Now
            </Link>
          </div>
          <div className="overflow-hidden border border-gray-200">
            <img
              src="https://st4.depositphotos.com/5354238/20734/i/450/depositphotos_207344950-stock-photo-women-clothing-hangers-boutique-store.jpg"
              alt="Fashion hero clothing"
              className="w-full h-[420px] object-cover"
            />
          </div>
        </div>
      </section>

      <SaleProductsSection products={saleProducts} />

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 bg-white border border-gray-200 grid md:grid-cols-2 gap-8 items-center">
          <img
            src="https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg"
            alt="Clothing promo"
            className="w-full h-[340px] object-cover"
          />
          <div className="py-8 pr-4">
            <p className="uppercase tracking-widest text-gray-500 text-lg">Clothing 2026</p>
            <h2 className="text-5xl font-semibold text-gray-900 mt-2">SALE UP TO 50% OFF</h2>
            <p className="text-sm text-gray-500 mt-4 mb-5">
              Discover premium shirts, dresses, denim, and seasonal essentials from live inventory.
            </p>
            <Link to="/collections" className="inline-block border border-gray-900 px-8 py-3 text-sm uppercase tracking-wide hover:bg-gray-900 hover:text-white transition-colors">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 bg-white border border-gray-200 p-10 text-center">
          <p className="text-4xl text-gray-400">"</p>
          <h3 className="text-4xl font-semibold uppercase text-gray-800 mb-3">Testimonials</h3>
          <p className="text-sm text-gray-600 max-w-3xl mx-auto">
            Users love the refined shopping flow, real-time cart interactions, and clean premium experience.
          </p>
          <p className="text-sm font-medium mt-4 text-gray-700">MARTIN FRANK</p>
        </div>
      </section>

      <NewArrivalsSection products={newArrivals.slice(0, 6)} />

      <RecommendationSection products={likeProducts} />

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 bg-white border border-gray-200 p-8 grid md:grid-cols-2 gap-8 items-center">
          <img
            src="https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg"
            alt="Fashion blog"
            className="w-full h-[300px] object-cover"
          />
          <div>
            <h3 className="text-4xl font-semibold uppercase text-gray-800">Latest Blogs</h3>
            <p className="text-sm text-gray-500 mt-4">
              Explore style guides, outfit inspiration, and clothing care tips for modern wardrobes.
            </p>
            <button className="mt-6 border border-gray-900 px-8 py-3 text-sm uppercase tracking-wide hover:bg-gray-900 hover:text-white transition-colors">
              Read More
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="bg-white border border-gray-200 py-6 text-center text-gray-400 uppercase tracking-[0.2em] text-sm">
              Brand
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
