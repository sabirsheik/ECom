import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../redux/slices/authSlices";
import { mergeCart } from "../redux/slices/CartSlice";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      const guestId = localStorage.getItem("guestId");
      if (guestId) {
        dispatch(mergeCart({ guestId }));
      }
      navigate(user.role === "admin" ? "/admin" : "/");
    }
  }, [user, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email: formData.email, password: formData.password }));
  };

  return (
    <div className="grid min-h-[calc(100vh-7rem)] grid-cols-1 bg-[var(--paper)] md:grid-cols-[0.85fr_1.15fr]">
      <div className="flex items-center justify-center px-5 py-16 sm:px-10 lg:px-16">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <p className="eyebrow mb-5">Private access</p>
          <h2 className="display-title text-5xl">Welcome back.</h2>
          <p className="mb-8 mt-3 max-w-sm text-sm leading-6 text-[var(--ink-soft)]">
            Enter your details to return to the current edit.
          </p>
            {error && (
              <div className="mb-5 border border-[#d9aaa0] bg-[#f7e9e5] p-3 text-sm text-[var(--error)]">
                {typeof error === "string"
                  ? error
                  : error.message || "Login failed. Please try again."}
              </div>
            )}
            <div className="mb-5">
              <label htmlFor="email" className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--ink-soft)]">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                className="premium-input"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--ink-soft)]">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                className="premium-input"
                placeholder="Your password"
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="premium-button w-full"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="mt-7 text-center text-sm text-[var(--ink-soft)]">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-[var(--bronze-deep)] hover:underline">
                Register
              </Link>
            </p>
          </form>
      </div>
      <div className="relative hidden overflow-hidden bg-[var(--graphite)] md:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(170,128,80,0.28),transparent_38%),linear-gradient(135deg,#0b0b0c,#24201b)]" />
        <div className="relative flex h-full flex-col justify-end p-12 text-[#eee9df] lg:p-20">
          <p className="eyebrow text-[#c8a87e]">E / C studio</p>
          <p className="display-title mt-5 max-w-md text-6xl leading-[0.9]">Quiet confidence, worn daily.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
