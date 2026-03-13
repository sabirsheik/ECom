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
    <>
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50">
        <div className="flex flex-col justify-center items-center p-8 md:p-12 animate-in fade-in duration-300">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white p-8 border border-gray-200 shadow-md"
          >
            <div className="mb-6">
              <h2 className="text-xl font-medium tracking-wide">E - Commerce</h2>
            </div>
            <h2 className="text-3xl font-semibold mb-2">Welcome back</h2>
            <p className="mb-6 text-sm text-gray-600">
              Enter your email and password to login
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 text-sm">
                {typeof error === "string"
                  ? error
                  : error.message || "Login failed. Please try again."}
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                className="w-full p-3 border border-gray-300 bg-white"
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                className="w-full p-3 border border-gray-300 bg-white"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-e-black text-white p-3 font-semibold hover:bg-e-hover transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="mt-6 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600">
                Register
              </Link>
            </p>
          </form>
        </div>
        <div className="hidden md:block bg-gray-900">
          <div className="h-full flex flex-col justify-center items-center">
            <img
              src={"https://picsum.photos/500/500?random=5"}
              alt="Login to account"
              className="h-full w-full object-cover opacity-90"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
