import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import MyOrderPages from "./MyOrderPages";
import {
  deleteUserProfile,
  fetchUserProfile,
  logout,
  updateUserProfile,
} from "../redux/slices/authSlices";
import { clearCart } from "../redux/slices/CartSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const initials = useMemo(() => {
    const words = (formData.name || user?.name || "User").trim().split(" ");
    return words.slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("");
  }, [formData.name, user?.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        updateUserProfile({
          name: formData.name,
          email: formData.email,
          password: formData.password || undefined,
        })
      ).unwrap();

      setFormData((prev) => ({ ...prev, password: "" }));
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to update profile");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(deleteUserProfile()).unwrap();
      dispatch(logout());
      dispatch(clearCart());
      toast.success("Account deleted successfully");
      navigate("/register");
    } catch (error) {
      toast.error(error?.message || "Failed to delete account");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Profile Info</h2>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 text-3xl font-bold text-amber-700">
              {initials}
            </div>
            <h1 className="text-xl font-semibold text-slate-900">{user?.name || "User"}</h1>
            <p className="mt-1 text-sm text-slate-500">{user?.email || "-"}</p>
            <span className="mt-3 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase text-slate-600">
              {user?.role || "customer"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 w-full rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition-colors duration-300 hover:bg-red-700"
          >
            Logout
          </button>

          <button
            onClick={handleDeleteAccount}
            className="mt-3 w-full rounded-lg border border-red-300 bg-white px-4 py-2.5 font-medium text-red-600 transition-colors duration-300 hover:bg-red-50"
          >
            Delete Account
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-5 text-2xl font-semibold text-slate-900">Edit Profile</h2>

          <form onSubmit={handleUpdateProfile} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">New Password (optional)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                placeholder="Leave empty to keep existing password"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white transition-colors duration-300 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">My Orders</h2>
        <MyOrderPages />
      </div>
    </div>
  );
};

export default Profile;
