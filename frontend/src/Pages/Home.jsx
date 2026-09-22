import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronRight, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchRecommendations } from "../redux/slices/ProductSlice";

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString("en-PK")}`;

const ProductCard = ({ product, priority = false }) => {
  const image = product?.images?.[0]?.url || "";
  const alt = product?.images?.[0]?.altText || product?.images?.[0]?.alt || product?.name || "Product";
  const hasDiscount = Number(product?.discountPrice || 0) > 0 && Number(product?.discountPrice) < Number(product?.price || 0);

  return (
    <Link to={`/product/${product?._id}`} className="group block" aria-label={product?.name}>
      <div className="relative overflow-hidden bg-[#eae3d7]">
        {image && (
          <img
            src={image}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            className="aspect-[3/4] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
          />
        )}
        {hasDiscount && (
          <span className="absolute left-3 top-3 bg-[var(--surface-elevated)] px-2 py-1 text-[0.55rem] font-bold uppercase tracking-[0.16em] text-[var(--ink)]">
            Sale
          </span>
        )}
        <button
          type="button"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-white/80 bg-white/75 text-[var(--ink)] backdrop-blur-sm transition duration-200 hover:bg-white"
          aria-label={`Save ${product?.name}`}
          onClick={(event) => event.preventDefault()}
        >
          <Heart size={15} strokeWidth={1.8} />
        </button>
      </div>
      <div className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="line-clamp-2 text-[0.95rem] font-medium leading-5 text-[var(--ink)]">{product?.name}</p>
            <p className="mt-1 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--ink-soft)]">{product?.category || "Collection"}</p>
          </div>
          <div className="shrink-0 text-right">
            {hasDiscount ? (
              <>
                <p className="text-sm font-semibold text-[var(--ink)]">{formatPrice(product.discountPrice)}</p>
                <p className="text-[0.68rem] text-[var(--ink-soft)] line-through">{formatPrice(product.price)}</p>
              </>
            ) : (
              <p className="text-sm font-semibold text-[var(--ink)]">{formatPrice(product?.price)}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
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
    ])
      .then(([all, arrivals]) => {
        setProducts(Array.isArray(all.data) ? all.data : []);
        setNewArrivals(Array.isArray(arrivals.data) ? arrivals.data : []);
      })
      .catch(() => {
        setProducts([]);
        setNewArrivals([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    dispatch(fetchRecommendations({ user, viewedProductIds }));
  }, [dispatch, user, viewedProductIds]);

  const heroProduct = useMemo(
    () => products.find((product) => product.gender === "Women") || products[0],
    [products]
  );

  const saleProducts = useMemo(
    () =>
      products
        .filter(
          (product) => Number(product.discountPrice || 0) > 0 && Number(product.discountPrice) < Number(product.price || 0)
        )
        .slice(0, 4),
    [products]
  );

  const womenEdit = useMemo(
    () => products.filter((product) => product.gender === "Women").slice(0, 3),
    [products]
  );

  const topWear = useMemo(
    () => products.filter((product) => product.category === "Top Wear").slice(0, 4),
    [products]
  );

  const curatedSupport = useMemo(
    () => products.filter((product) => product.category === "Bottom Wear").slice(0, 3),
    [products]
  );

  const recommendationProducts = Array.isArray(recommendations) ? recommendations.slice(0, 4) : [];
  const heroImage = heroProduct?.images?.[0]?.url || "";

  const categoryCards = [
    { title: "Men", link: "/collections?gender=Men", image: products.find((product) => product.gender === "Men")?.images?.[0]?.url },
    { title: "Women", link: "/collections?gender=Women", image: products.find((product) => product.gender === "Women")?.images?.[0]?.url },
    { title: "Top Wear", link: "/collections?category=Top%20Wear", image: products.find((product) => product.category === "Top Wear")?.images?.[0]?.url },
    { title: "Bottom Wear", link: "/collections?category=Bottom%20Wear", image: products.find((product) => product.category === "Bottom Wear")?.images?.[0]?.url },
  ];

  if (loading) {
    return (
      <main className="storefront-shell">
        <div className="section-shell py-24">
          <div className="animate-pulse rounded-none bg-[#e7e0d5]" style={{ height: "68vh" }} />
        </div>
      </main>
    );
  }

  return (
    <main className="storefront-shell">
      <section className="section-shell pt-8 md:pt-10">
        <div className="grid min-h-[68vh] items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div className="pt-6 lg:pt-12">
            <p className="eyebrow reveal-up">The current edit</p>
            <h1 className="display-title reveal-up mt-5 max-w-xl text-5xl leading-[0.9] sm:text-6xl lg:text-[5rem]" style={{ animationDelay: "120ms" }}>
              Everyday pieces, considered.
            </h1>
            <p className="reveal-up mt-6 max-w-lg text-sm leading-7 text-[var(--ink-soft)] sm:text-base" style={{ animationDelay: "220ms" }}>
              A quiet wardrobe of elevated essentials for modern movement—clean silhouettes, tactile fabrics, and the kind of pieces that work harder and live longer.
            </p>
            <div className="reveal-up mt-8 flex flex-wrap items-center gap-5" style={{ animationDelay: "320ms" }}>
              <Link to="/collections" className="inline-flex items-center gap-3 bg-[var(--graphite)] px-6 py-4 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--bronze-deep)]">
                Shop the collection <ArrowRight size={15} strokeWidth={1.8} />
              </Link>
              <Link to="/collections?gender=Women" className="editorial-link">
                Women <ChevronRight size={14} strokeWidth={1.8} />
              </Link>
            </div>
            {heroProduct && (
              <div className="reveal-up mt-10 flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--ink-soft)]" style={{ animationDelay: "420ms" }}>
                <Sparkles size={13} className="text-[var(--bronze-deep)]" />
                Featured now
                <span className="text-[var(--bronze)]">/</span>
                <span className="text-[var(--ink)]">{heroProduct.name}</span>
              </div>
            )}
          </div>

          <div className="hero-card reveal-up" style={{ animationDelay: "170ms" }}>
            {heroImage && (
              <img src={heroImage} alt={heroProduct?.name || "Featured product"} className="h-full w-full object-cover" />
            )}
            <div className="hero-panel">
              <span>E / C Studio</span>
              <span>01 / 01</span>
            </div>
            <div className="hero-floating-card">
              <span className="eyebrow text-[0.56rem] text-[#8b7355]">New arrival</span>
              <p className="mt-2 text-lg font-medium text-[var(--ink)]">{heroProduct?.name}</p>
              <p className="mt-2 text-sm font-semibold text-[var(--graphite)]">{formatPrice(heroProduct?.price)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="category-strip">
          {categoryCards.map((category) => (
            <Link key={category.title} to={category.link} className="category-chip group">
              <span>{category.title}</span>
              <ArrowRight size={14} strokeWidth={1.7} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      <section className="section-shell py-12 md:py-16 lg:py-20">
        <div className="content-grid editorial-split">
          <div className="feature-visual">
            {heroProduct?.images?.[1]?.url ? (
              <img src={heroProduct.images[1].url} alt={heroProduct.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-[#e5ded3]" />
            )}
          </div>

          <div className="feature-copy">
            <p className="eyebrow">Featured collection</p>
            <h2 className="display-title text-4xl sm:text-5xl lg:text-[4rem]">Soft structure, sharp intent.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[var(--ink-soft)] sm:text-base">
              Built around exceptional basics, this edit balances clean lines with tactile comfort for the way you move from morning to late evening.
            </p>
            <Link to="/collections" className="editorial-link mt-8 inline-flex">
              Shop the edit <ChevronRight size={14} strokeWidth={1.8} />
            </Link>

            <div className="mt-10 space-y-4">
              {womenEdit.slice(0, 2).map((product) => (
                <Link key={product._id} to={`/product/${product._id}`} className="mini-feature-item">
                  <div className="mini-feature-image">
                    {product.images?.[0]?.url && <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />}
                  </div>
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--ink-soft)]">{product.category}</p>
                    <h3 className="mt-2 text-lg font-medium text-[var(--ink)]">{product.name}</h3>
                    <p className="mt-2 text-sm font-semibold text-[var(--ink)]">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-12 md:py-16 lg:py-20">
        <div className="section-header">
          <div>
            <p className="eyebrow">New arrivals</p>
            <h2 className="display-title text-4xl sm:text-5xl">Latest pieces</h2>
          </div>
          <Link to="/collections" className="editorial-link hidden sm:inline-flex">
            View all <ArrowRight size={14} strokeWidth={1.8} />
          </Link>
        </div>

        <div className="product-grid">
          {(newArrivals.length ? newArrivals : products).slice(0, 4).map((product, index) => (
            <div key={product._id || index} className="reveal-up" style={{ animationDelay: `${index * 80}ms` }}>
              <ProductCard product={product} priority={index < 2} />
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell py-12 md:py-16 lg:py-20">
        <div className="visual-break">
          <div className="visual-break-copy">
            <p className="eyebrow text-[#d8c0a0]">A considered edit</p>
            <h2 className="display-title mt-4 text-4xl sm:text-5xl lg:text-[4.2rem]">Quiet confidence for the everyday.</h2>
            <Link to="/collections" className="mt-7 inline-flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white hover:text-[#d8c0a0]">
              Shop the edit <ArrowRight size={14} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-shell py-12 md:py-16 lg:py-20">
        <div className="showcase-grid">
          <div className="showcase-feature">
            {topWear[0]?.images?.[0]?.url && <img src={topWear[0].images[0].url} alt={topWear[0].name} className="h-full w-full object-cover" />}
            <div className="showcase-feature-copy">
              <p className="eyebrow text-[#d8c0a0]">For the modern uniform</p>
              <h3 className="display-title mt-3 text-4xl">Refined essentials</h3>
            </div>
          </div>

          <div className="showcase-side">
            <div className="showcase-copy">
              <p className="eyebrow">Curated selection</p>
              <h3 className="display-title mt-3 text-4xl sm:text-5xl">Made for layering.</h3>
              <p className="mt-4 max-w-md text-sm leading-7 text-[var(--ink-soft)]">
                From tactile knits to crisp shirting, our edits are built to shift seamlessly from work to weekend.
              </p>
              <Link to="/collections?category=Top%20Wear" className="editorial-link mt-7 inline-flex">
                Shop top wear <ChevronRight size={14} strokeWidth={1.8} />
              </Link>
            </div>

            <div className="mini-product-grid">
              {curatedSupport.slice(0, 2).map((product) => (
                <Link key={product._id} to={`/product/${product._id}`} className="mini-product-card">
                  {product.images?.[0]?.url && <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />}
                  <div className="px-3 pb-3 pt-2">
                    <p className="text-[0.7rem] uppercase tracking-[0.16em] text-[var(--ink-soft)]">{product.category}</p>
                    <p className="mt-2 text-sm font-medium text-[var(--ink)]">{product.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-12 md:py-16 lg:py-20">
        <div className="category-showcase">
          {categoryCards.map((category, index) => (
            <Link key={category.title} to={category.link} className={`category-card ${index === 0 ? "large" : ""}`}>
              <div className="category-card-image">
                {category.image && <img src={category.image} alt={category.title} className="h-full w-full object-cover" />}
              </div>
              <div className="category-card-copy">
                <span>{category.title}</span>
                <ArrowRight size={16} strokeWidth={1.8} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-shell py-12 md:py-16 lg:py-20">
        <div className="brand-statement">
          <div className="brand-statement-topline">
            <span>01</span>
            <span>Designed for the everyday</span>
            <span>Est. 2026</span>
          </div>
          <p>Everyday pieces,</p>
          <p className="brand-statement-indent">considered.</p>
          <div className="brand-statement-footline">
            <span />
            <p>Less noise. More intention.</p>
            <span />
          </div>
        </div>
      </section>

      <section className="section-shell pb-16 pt-6 md:pb-20 lg:pb-24">
        <div className="newsletter-shell">
          <div>
            <p className="eyebrow text-[#c5a87b]">Journal</p>
            <h2 className="display-title mt-4 text-4xl sm:text-5xl">A weekly edit for thoughtful dressing.</h2>
            <p className="newsletter-note">New arrivals, considered styling, and a quieter way to shop.</p>
          </div>
          <div className="newsletter-form">
            <input type="email" placeholder="Email address" aria-label="Email address" />
            <button type="button">Join the edit <ArrowRight size={14} strokeWidth={1.8} /></button>
          </div>
        </div>
      </section>

      {recommendationProducts.length > 0 && (
        <section className="section-shell pb-20">
          <div className="section-header">
            <div>
              <p className="eyebrow">For your wardrobe</p>
              <h2 className="display-title text-4xl sm:text-5xl">You may also like</h2>
            </div>
          </div>
          <div className="product-grid">
            {recommendationProducts.map((product, index) => (
              <div key={product._id || index} className="reveal-up" style={{ animationDelay: `${index * 80}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default Home;
