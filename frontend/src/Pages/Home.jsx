import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { LazyMotion, m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { toast } from "sonner";
import { fetchRecommendations, toggleWishlistProduct } from "../redux/slices/ProductSlice";
import { setUserWishlist } from "../redux/slices/authSlices";
import { addToCart } from "../redux/slices/CartSlice";
import "./Home.css";

const API_URL = import.meta.env.VITE_BACKEND_URL;
const MotionDiv = m.div;
const MotionImg = m.img;
const MotionArticle = m.article;
const MotionP = m.p;
const MotionH1 = m.h1;
const loadMotionFeatures = () => import("framer-motion").then(({ domAnimation }) => domAnimation);

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString("en-PK")}`;

const revealVariants = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 },
};

const Reveal = ({ children, className = "", delay = 0, ...props }) => {
  const reduceMotion = useReducedMotion();

  return (
    <MotionDiv
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.16 }}
      transition={{
        duration: reduceMotion ? 0.01 : 0.72,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...props}
    >
      {children}
    </MotionDiv>
  );
};

const ProductCard = ({ product, index = 0 }) => {
  const dispatch = useDispatch();
  const { user, guestId, userId } = useSelector((state) => state.auth);
  const { guestWishlist, viewedProductIds } = useSelector((state) => state.product);
  const [wishlistPending, setWishlistPending] = useState(false);
  const [cartPending, setCartPending] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const image = product?.images?.[0];
  const alternateImage = product?.images?.[1];
  const likedIds = user?.wishlist?.map((id) => id.toString()) || guestWishlist || [];
  const isLiked = likedIds.includes(product?._id?.toString());
  const hasDiscount =
    Number(product?.discountPrice || 0) > 0 &&
    Number(product.discountPrice) < Number(product?.price || 0);
  const canQuickAdd =
    Number(product?.countInStock || 0) > 0 &&
    Array.isArray(product?.sizes) &&
    product.sizes.length > 0 &&
    Array.isArray(product?.colors) &&
    product.colors.length > 0;

  const handleWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setWishlistPending(true);

    try {
      const result = await dispatch(
        toggleWishlistProduct({
          productId: product._id,
          isAuthenticated: Boolean(user),
        })
      ).unwrap();

      if (result.wishlist) {
        dispatch(setUserWishlist(result.wishlist));
      }

      dispatch(fetchRecommendations({ user, viewedProductIds }));
      toast.success(isLiked ? "Removed from your edit" : "Saved to your edit", {
        duration: 1300,
      });
    } catch (error) {
      toast.error(error?.message || "Your wishlist could not be updated");
    } finally {
      setWishlistPending(false);
    }
  };

  const handleQuickAdd = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setCartPending(true);

    try {
      await dispatch(
        addToCart({
          productId: product._id,
          quantity: 1,
          size: product.sizes[0],
          color: product.colors[0],
          guestId,
          userId,
        })
      ).unwrap();
      setAddedToCart(true);
      toast.success(`${product.name} added to your bag`, { duration: 1500 });
      window.setTimeout(() => setAddedToCart(false), 1600);
    } catch (error) {
      toast.error(error?.message || "Could not add this piece to your bag");
    } finally {
      setCartPending(false);
    }
  };

  return (
    <MotionArticle
      className="home-product-card group"
      variants={revealVariants}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="home-product-visual">
        <Link
          to={`/product/${product?._id}`}
          className="absolute inset-0 block overflow-hidden"
          aria-label={`View ${product?.name}`}
        >
          {image?.url && (
            <img
              src={image.url}
              alt={image.altText || image.alt || product?.name || "Featured clothing"}
              loading={index < 2 ? "eager" : "lazy"}
              decoding="async"
              className="home-product-image"
              onError={(event) => {
                if (alternateImage?.url && event.currentTarget.dataset.fallback !== "used") {
                  event.currentTarget.dataset.fallback = "used";
                  event.currentTarget.src = alternateImage.url;
                } else {
                  event.currentTarget.style.visibility = "hidden";
                }
              }}
            />
          )}
          {alternateImage?.url && (
            <img
              src={alternateImage.url}
              alt=""
              loading="lazy"
              decoding="async"
              className="home-product-image home-product-image-alt"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          )}
        </Link>
        <div className="home-product-badges">
          {hasDiscount && <span className="home-product-badge">Selected price</span>}
          {Number(product?.countInStock || 0) < 1 && (
            <span className="home-product-badge">Sold out</span>
          )}
        </div>
        <button
          type="button"
          onClick={handleWishlist}
          disabled={wishlistPending}
          className={`home-wishlist-button ${isLiked ? "is-liked" : ""}`}
          aria-label={isLiked ? `Remove ${product?.name} from wishlist` : `Save ${product?.name}`}
          aria-pressed={isLiked}
        >
          <Heart size={17} strokeWidth={1.7} fill={isLiked ? "currentColor" : "none"} />
        </button>
        {canQuickAdd && (
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={cartPending}
            className={`home-quick-add ${addedToCart ? "is-added" : ""}`}
            aria-label={`Add ${product?.name} to bag in size ${product.sizes[0]} and color ${product.colors[0]}`}
          >
            {cartPending ? "Adding…" : addedToCart ? "Added to bag" : "Quick add"}
            {!cartPending && !addedToCart && <ArrowUpRight size={15} />}
          </button>
        )}
      </div>
      <Link to={`/product/${product?._id}`} className="home-product-details">
        <div className="home-product-copy">
          <p className="home-product-category">{product?.category || "The collection"}</p>
          <h3>{product?.name}</h3>
        </div>
        <div className="home-product-prices">
          <span className={hasDiscount ? "home-discount-price" : ""}>
            {formatPrice(hasDiscount ? product.discountPrice : product?.price)}
          </span>
          {hasDiscount && <del>{formatPrice(product.price)}</del>}
        </div>
      </Link>
      {canQuickAdd && (
        <p className="home-variant-note">
          Quick add uses {product.sizes[0]} / {product.colors[0]}
        </p>
      )}
    </MotionArticle>
  );
};

const SectionHeading = ({ eyebrow, title, copy, link, linkLabel = "Explore the collection" }) => (
  <div className="home-section-heading">
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display-title">{title}</h2>
    </div>
    <div className="home-section-aside">
      {copy && <p>{copy}</p>}
      {link && (
        <Link to={link} className="home-text-link">
          {linkLabel} <ArrowRight size={15} />
        </Link>
      )}
    </div>
  </div>
);

const Home = () => {
  const dispatch = useDispatch();
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { recommendations, viewedProductIds } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "11%"]);
  const heroImageScale = useTransform(scrollYProgress, [0, 1], [1.03, reduceMotion ? 1.03 : 1.12]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadHomeProducts = async () => {
      setLoading(true);
      setLoadError("");

      const [catalogueResult, arrivalsResult] = await Promise.allSettled([
        axios.get(`${API_URL}/api/products`, { signal: controller.signal }),
        axios.get(`${API_URL}/api/products/product-newarrivals`, { signal: controller.signal }),
      ]);

      if (!active) return;

      const catalogue = catalogueResult.status === "fulfilled" && Array.isArray(catalogueResult.value.data)
        ? catalogueResult.value.data
        : [];
      const arrivals = arrivalsResult.status === "fulfilled" && Array.isArray(arrivalsResult.value.data)
        ? arrivalsResult.value.data
        : [];

      setProducts(catalogue);
      setNewArrivals(arrivals);

      if (catalogueResult.status === "rejected" && arrivalsResult.status === "rejected") {
        setLoadError("We couldn’t load the collection just now. Please try again.");
      } else if (catalogueResult.status === "rejected") {
        setLoadError("Showing the latest available pieces. The full collection could not be loaded.");
      }

      setLoading(false);
    };

    loadHomeProducts();
    return () => {
      active = false;
      controller.abort();
    };
  }, [retryKey]);

  useEffect(() => {
    dispatch(fetchRecommendations({ user, viewedProductIds }));
  }, [dispatch, user, viewedProductIds]);

  const heroProduct = useMemo(
    () => products.find((product) => product.gender === "Women") || products[0] || newArrivals[0],
    [products, newArrivals]
  );
  const heroImage = heroProduct?.images?.[0]?.url || "";
  const featuredProducts = useMemo(
    () => (newArrivals.length ? newArrivals : products).slice(0, 4),
    [newArrivals, products]
  );
  const saleProduct = useMemo(
    () =>
      products.find(
        (product) =>
          Number(product.discountPrice || 0) > 0 &&
          Number(product.discountPrice) < Number(product.price || 0) &&
          product.images?.[0]?.url
      ),
    [products]
  );
  const collectionTiles = useMemo(
    () => [
      {
        title: "Women",
        href: "/collections?gender=Women",
        product: products.find((product) => product.gender === "Women" && product.images?.[0]?.url),
        description: "Pieces with ease, made for everywhere.",
        size: "large",
      },
      {
        title: "Men",
        href: "/collections?gender=Men",
        product: products.find((product) => product.gender === "Men" && product.images?.[0]?.url),
        description: "A sharper take on the daily uniform.",
        size: "small",
      },
    ],
    [products]
  );
  const featuredProductIds = new Set(featuredProducts.map((product) => product._id));
  const recommendationProducts = Array.isArray(recommendations)
    ? recommendations
        .filter(
          (product) =>
            product?._id &&
            !featuredProductIds.has(product._id) &&
            product.images?.[0]?.url
        )
        .slice(0, 4)
    : [];

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();
    if (submittingNewsletter) return;

    setSubmittingNewsletter(true);
    setNewsletterState("idle");
    setNewsletterMessage("");

    try {
      const response = await axios.post(`${API_URL}/api/subscribe`, {
        email: newsletterEmail.trim(),
      });
      setNewsletterState("success");
      setNewsletterMessage(response.data?.message || "You’re on the list. Thank you.");
      setNewsletterEmail("");
    } catch (error) {
      setNewsletterState("error");
      setNewsletterMessage(
        error.response?.data?.message || "We couldn’t add you just now. Please try again."
      );
    } finally {
      setSubmittingNewsletter(false);
    }
  };

  if (loading) {
    return (
      <main className="storefront-shell home-page">
        <section className="section-shell home-hero home-loading" aria-label="Loading the collection">
          <div className="home-loading-copy">
            <span className="home-skeleton home-skeleton-eyebrow" />
            <span className="home-skeleton home-skeleton-title" />
            <span className="home-skeleton home-skeleton-copy" />
          </div>
          <div className="home-skeleton home-loading-image" />
        </section>
        <p className="sr-only" role="status">Loading the latest collection.</p>
      </main>
    );
  }

  return (
    <LazyMotion features={loadMotionFeatures}>
      <main className="storefront-shell home-page">
        <section ref={heroRef} className="section-shell home-hero">
        <div className="home-hero-copy">
          <MotionP
            className="eyebrow home-kicker"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.55, delay: 0.08 }}
          >
            E / C Studio <span>—</span> The current edit
          </MotionP>
          <MotionH1
            className="display-title home-hero-title"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.78, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            Everyday pieces,
            <em> considered.</em>
          </MotionH1>
          <MotionP
            className="home-hero-description"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.65, delay: 0.28 }}
          >
            A quieter wardrobe of elevated essentials: clean silhouettes, tactile fabrics, and pieces made to stay in rotation.
          </MotionP>
          <MotionDiv
            className="home-hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.62, delay: 0.38 }}
          >
            <Link to="/collections" className="home-button">
              Shop collection <ArrowUpRight size={16} />
            </Link>
            <Link to="/collections?gender=Women" className="home-text-link">
              Explore the edit <ArrowRight size={15} />
            </Link>
          </MotionDiv>
          {heroProduct && (
            <MotionDiv
              className="home-featured-note"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.55, delay: 0.62 }}
            >
              <span className="home-note-line" />
              <span>Featured now</span>
              <Link to={`/product/${heroProduct._id}`}>{heroProduct.name}</Link>
            </MotionDiv>
          )}
          {loadError && (
            <p className="home-inline-error" role="status">
              {loadError}{" "}
              <button type="button" onClick={() => setRetryKey((value) => value + 1)}>
                Retry
              </button>
            </p>
          )}
          {!heroProduct && !loadError && (
            <p className="home-inline-error" role="status">
              The collection is being refreshed. Please check back soon.
            </p>
          )}
        </div>

        <MotionDiv
          className="home-hero-visual"
          initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: reduceMotion ? 0.01 : 1.05, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          {heroImage ? (
            <MotionImg
              src={heroImage}
              alt={heroProduct?.images?.[0]?.altText || heroProduct?.name || "Featured piece"}
              className="home-hero-image"
              style={{ y: heroImageY, scale: heroImageScale }}
              fetchPriority="high"
              decoding="async"
            />
          ) : (
            <div className="home-hero-image-placeholder" />
          )}
          <div className="home-hero-image-shade" />
          <div className="home-hero-image-meta">
            <span>Wear the everyday well</span>
            <span>01 / E—C</span>
          </div>
          {heroProduct && (
            <Link to={`/product/${heroProduct._id}`} className="home-hero-product">
              <span className="home-hero-product-label">The current pick</span>
              <span className="home-hero-product-name">{heroProduct.name}</span>
              <span className="home-hero-product-price">{formatPrice(heroProduct.price)}</span>
              <ArrowUpRight size={18} />
            </Link>
          )}
        </MotionDiv>
        <a className="home-scroll-cue" href="#home-arrivals" aria-label="Scroll to new arrivals">
          <span>Scroll to discover</span>
          <ArrowDown size={14} />
        </a>
        </section>

      <div className="home-principles" aria-label="E / C Studio design principles">
        <span>Less, but better chosen</span>
        <span aria-hidden="true">✳</span>
        <span>Considered in every detail</span>
        <span aria-hidden="true">✳</span>
        <span>Made to live in</span>
      </div>

      {featuredProducts.length > 0 && (
        <section id="home-arrivals" className="section-shell home-section home-arrivals">
          <Reveal>
            <SectionHeading
              eyebrow="New arrivals"
              title="A fresh point of view."
              copy="New pieces, chosen for how they feel and how often you’ll reach for them."
              link="/collections"
              linkLabel="View all pieces"
            />
          </Reveal>
          <MotionDiv
            className="home-product-grid"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
          >
            {featuredProducts.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </MotionDiv>
        </section>
      )}

      {collectionTiles.some(({ product }) => product) && (
        <section className="section-shell home-section home-collections">
          <Reveal>
            <SectionHeading
              eyebrow="Find your point of view"
              title="Collections, in their own light."
              copy="Explore the pieces through the way you like to get dressed."
            />
          </Reveal>
          <div className="home-collection-grid">
            {collectionTiles.map(({ title, href, product, description, size }, index) =>
              product ? (
                <Reveal key={title} className={`home-collection-tile home-collection-${size}`} delay={index * 0.1}>
                  <Link to={href} className="home-collection-link">
                    <img
                      src={product.images[0].url}
                      alt={product.images[0].altText || product.name}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="home-collection-wash" />
                    <span className="home-collection-copy">
                      <span className="home-collection-overline">The {title.toLowerCase()} edit</span>
                      <span className="display-title home-collection-title">{title}</span>
                      <span className="home-collection-description">{description}</span>
                      <span className="home-collection-cta">
                        Explore {title} <ArrowUpRight size={17} />
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ) : null
            )}
          </div>
        </section>
      )}

      {heroProduct && (
        <section className="home-story">
          <div className="section-shell home-story-layout">
            <Reveal className="home-story-image-wrap">
              <img
                src={heroProduct.images?.[1]?.url || heroImage}
                alt={heroProduct.images?.[1]?.altText || heroProduct.name}
                loading="lazy"
                decoding="async"
              />
              <span className="home-story-image-caption">A wardrobe with room to breathe</span>
            </Reveal>
            <Reveal className="home-story-copy" delay={0.12}>
              <p className="eyebrow">The E / C point of view</p>
              <h2 className="display-title">Style should feel like <em>your own.</em></h2>
              <p>
                We believe getting dressed can be simple: thoughtful pieces, a little texture, and the freedom to make them yours.
              </p>
              <Link to="/collections" className="home-button home-button-light">
                Find your everyday <ArrowUpRight size={16} />
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {saleProduct && (
        <section className="section-shell home-section home-campaign">
          <Reveal className="home-campaign-image">
            <Link to={`/product/${saleProduct._id}`} aria-label={`Shop ${saleProduct.name}`}>
              <img
                src={saleProduct.images[0].url}
                alt={saleProduct.images[0].altText || saleProduct.name}
                loading="lazy"
                decoding="async"
              />
            </Link>
            <span className="home-campaign-caption">A considered find</span>
          </Reveal>
          <Reveal className="home-campaign-copy" delay={0.12}>
            <p className="eyebrow">Selected pieces</p>
            <h2 className="display-title">Good things, at a gentler price.</h2>
            <p>Discover a considered selection from the collection, while these pieces are available.</p>
            <Link to={`/product/${saleProduct._id}`} className="home-campaign-product">
              <span>{saleProduct.name}</span>
              <span>
                <strong>{formatPrice(saleProduct.discountPrice)}</strong>
                <del>{formatPrice(saleProduct.price)}</del>
              </span>
              <ArrowUpRight size={17} />
            </Link>
            <Link to="/collections" className="home-text-link">
              Explore the selection <ArrowRight size={15} />
            </Link>
          </Reveal>
        </section>
      )}

      {recommendationProducts.length > 0 && (
        <section className="section-shell home-section home-recommendations">
          <Reveal>
            <SectionHeading
              eyebrow="For your wardrobe"
              title="A few more to consider."
              copy="A selection informed by the pieces you’ve explored and saved."
              link="/collections"
              linkLabel="Explore everything"
            />
          </Reveal>
          <MotionDiv
            className="home-product-grid"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
          >
            {recommendationProducts.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index + 2} />
            ))}
          </MotionDiv>
        </section>
      )}

      <section className="section-shell home-newsletter-section">
        <Reveal className="home-newsletter">
          <div className="home-newsletter-copy">
            <p className="eyebrow">The E / C journal</p>
            <h2 className="display-title">A little more considered.</h2>
            <p>New arrivals, thoughtful styling, and notes from the current edit.</p>
          </div>
          <form className="home-newsletter-form" onSubmit={handleNewsletterSubmit}>
            <label htmlFor="home-newsletter-email">Your email address</label>
            <div className="home-newsletter-controls">
              <input
                id="home-newsletter-email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="you@example.com"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                disabled={submittingNewsletter}
                aria-describedby={newsletterMessage ? "home-newsletter-message" : undefined}
              />
              <button type="submit" disabled={submittingNewsletter}>
                {submittingNewsletter ? "Joining…" : "Join the edit"}
                {!submittingNewsletter && <ArrowRight size={15} />}
              </button>
            </div>
            {newsletterMessage && (
              <p
                id="home-newsletter-message"
                className={`home-newsletter-feedback is-${newsletterState}`}
                role={newsletterState === "error" ? "alert" : "status"}
              >
                {newsletterMessage}
              </p>
            )}
          </form>
        </Reveal>
      </section>
      </main>
    </LazyMotion>
  );
};

export default Home;
