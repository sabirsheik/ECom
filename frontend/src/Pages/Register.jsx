import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../redux/slices/authSlices";
import { mergeCart } from "../redux/slices/CartSlice";
import { useDispatch, useSelector } from "react-redux";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      const guestId = localStorage.getItem("guestId");
      if (guestId) {
        dispatch(mergeCart({ guestId }));
      }
      navigate("/");
    }
  }, [user, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
    );
  };

  return (
    <div className="grid min-h-[calc(100vh-7rem)] grid-cols-1 bg-[var(--paper)] md:grid-cols-[0.85fr_1.15fr]">
      <div className="flex items-center justify-center px-5 py-16 sm:px-10 lg:px-16">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <p className="eyebrow mb-5">Begin here</p>
          <h2 className="display-title text-5xl">Make room for more.</h2>
          <p className="mb-8 mt-3 max-w-sm text-sm leading-6 text-[var(--ink-soft)]">Create an account to save pieces and follow your orders.</p>
            {error && (
              <div className="mb-5 border border-[#d9aaa0] bg-[#f7e9e5] p-3 text-sm text-[var(--error)]">
                {typeof error === "string"
                  ? error
                  : error.message || "Registration failed. Please try again."}
              </div>
            )}
            <div className="mb-5">
              <label htmlFor="name" className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--ink-soft)]">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={handleChange}
                value={formData.name}
                className="premium-input"
                placeholder="Your name"
                required
                autoComplete="name"
              />
            </div>
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
                placeholder="At least 6 characters"
                required
                autoComplete="new-password"
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="premium-button w-full"
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <p className="mt-7 text-center text-sm text-[var(--ink-soft)]">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[var(--bronze-deep)] hover:underline">
                Login
              </Link>
            </p>
          </form>
      </div>
      <div className="relative hidden overflow-hidden bg-[var(--graphite)] md:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_65%,rgba(170,128,80,0.3),transparent_40%),linear-gradient(135deg,#0b0b0c,#24201b)]" />
        <div className="relative flex h-full flex-col justify-end p-12 text-[#eee9df] lg:p-20">
          <p className="eyebrow text-[#c8a87e]">The current edit</p>
          <p className="display-title mt-5 max-w-md text-6xl leading-[0.9]">Things with a longer life.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
