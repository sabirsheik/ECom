import React, { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import "./Footer.css";

const Footer = ({ showNewsletter = true }) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  const handleSubscribe = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setFeedback("");
    setFeedbackType("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/subscribe`,
        { email: email.trim() }
      );
      setEmail("");
      setFeedbackType("success");
      setFeedback(response.data?.message || "You’re on the list. Thank you.");
      toast.success("You’re on the list.");
    } catch (error) {
      const message =
        error.response?.data?.message || "We couldn’t subscribe you. Please try again.";
      setFeedbackType("error");
      setFeedback(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="store-footer">
      <div className="store-footer-top content-shell">
        <div className="store-footer-brand">
          <Link to="/" className="store-footer-wordmark" aria-label="E / C Studio home">
            E<span>/</span>C
          </Link>
          <p className="store-footer-brand-line">A considered wardrobe for everyday life.</p>
          <p className="store-footer-brand-copy">
            Thoughtful pieces. Personal style. A little more room to be yourself.
          </p>
          <div className="store-footer-socials" aria-label="Follow E / C Studio">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <IoLogoInstagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <TbBrandMeta />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="X">
              <RiTwitterXLine />
            </a>
          </div>
        </div>

        {showNewsletter && (
          <div className="store-footer-newsletter">
            <p className="store-footer-label">A note from the studio</p>
            <h2 className="display-title">The good things, occasionally.</h2>
            <p className="store-footer-newsletter-copy">
              New arrivals, thoughtful styling, and notes from the current edit.
            </p>
            <form className="store-footer-form" onSubmit={handleSubscribe}>
              <label className="sr-only" htmlFor="footer-newsletter-email">
                Email address
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                name="email"
                autoComplete="email"
                maxLength={254}
                placeholder="Your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={submitting}
                required
              />
              <button type="submit" disabled={submitting} aria-label="Subscribe to the newsletter">
                {submitting ? "Joining…" : "Join the edit"}
                {!submitting && <ArrowRight size={16} />}
              </button>
            </form>
            {feedback && (
              <p
                className={`store-footer-feedback is-${feedbackType}`}
                role={feedbackType === "error" ? "alert" : "status"}
              >
                {feedback}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="content-shell store-footer-links">
        <div className="store-footer-link-column">
          <h3>Explore</h3>
          <Link to="/collections">All pieces <ArrowUpRight size={13} /></Link>
          <Link to="/collections?gender=Women">Women <ArrowUpRight size={13} /></Link>
          <Link to="/collections?gender=Men">Men <ArrowUpRight size={13} /></Link>
          <Link to="/collections?category=Top%20Wear">Top wear <ArrowUpRight size={13} /></Link>
          <Link to="/collections?category=Bottom%20Wear">Bottom wear <ArrowUpRight size={13} /></Link>
        </div>
        <div className="store-footer-link-column">
          <h3>Your account</h3>
          <Link to="/profile">Account <ArrowUpRight size={13} /></Link>
          <Link to="/my-order">Your orders <ArrowUpRight size={13} /></Link>
          <Link to="/login">Get in touch <ArrowUpRight size={13} /></Link>
        </div>
        <Link to="/collections" className="store-footer-backtop">
          Find your everyday <ArrowRight size={16} />
        </Link>
      </div>

      <div className="content-shell store-footer-bottom">
        <Link to="/" className="store-footer-bottom-mark">E / C STUDIO</Link>
        <p>
          © {new Date().getFullYear()} E / C Studio <span>·</span> All rights reserved
        </p>
        <span className="store-footer-signoff">Wear what feels like you.</span>
      </div>
    </footer>
  );
};

export default Footer;
