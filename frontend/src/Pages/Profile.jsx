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
    <div className="min-h-screen bg-[var(--paper)] px-5 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-3">
        <div className="premium-panel p-6">
          <p className="eyebrow mb-3">Account / Identity</p>
          <h2 className="display-title mb-5 text-4xl">Profile</h2>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center bg-[var(--graphite)] text-3xl font-bold text-[#eee9df]">
              {initials}
            </div>
            <h1 className="display-title text-3xl">{user?.name || "User"}</h1>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">{user?.email || "-"}</p>
            <span className="mt-3 inline-block bg-[var(--paper)] px-3 py-1 text-xs font-medium uppercase text-[var(--ink-soft)]">
              {user?.role || "customer"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="premium-button mt-6 w-full"
          >
            Logout
          </button>

          <button
            onClick={handleDeleteAccount}
            className="mt-3 w-full border border-[#d9aaa0] bg-transparent px-4 py-2.5 font-medium text-[var(--error)] transition-colors duration-300 hover:bg-[#f7e9e5]"
          >
            Delete Account
          </button>
        </div>

        <div className="premium-panel p-6 lg:col-span-2">
          <p className="eyebrow mb-2">Account / Details</p>
          <h2 className="display-title mb-7 text-4xl">Edit profile</h2>

          <form onSubmit={handleUpdateProfile} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--ink-soft)]">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="premium-input"
              />
            </div>

            <div>
              <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--ink-soft)]">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="premium-input"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--ink-soft)]">New Password (optional)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                placeholder="Leave empty to keep existing password"
                className="premium-input"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="premium-button disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="premium-panel mx-auto mt-8 max-w-[1200px] p-6">
        <p className="eyebrow mb-2">Account / Activity</p>
        <h2 className="display-title mb-4 text-4xl">My orders</h2>
        <MyOrderPages />
      </div>
    </div>
  );
};

export default Profile;
