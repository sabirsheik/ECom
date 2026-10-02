import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { addUser, deleteUser, fetchUsers, updateUser } from "../../redux/slices/AdminSlice";

const emptyForm = { name: "", email: "", password: "", role: "customer" };

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, saving, deletingId, error } = useSelector((state) => state.admin);
  const currentUserId = useSelector((state) => state.auth.user?.id || state.auth.user?._id);
  const [formData, setFormData] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingUserId, setEditingUserId] = useState(null);
  const [userEdits, setUserEdits] = useState({ name: "", email: "" });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query);
      return matchesSearch && (roleFilter === "all" || user.role === roleFilter);
    });
  }, [users, search, roleFilter]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(addUser(formData)).unwrap();
      setFormData(emptyForm);
      toast.success("User created");
    } catch (requestError) {
      toast.error(requestError.message || "Could not create user");
    }
  };

  const handleRoleChange = async (user, role) => {
    try {
      await dispatch(updateUser({ id: user._id, role })).unwrap();
      toast.success("User role updated");
    } catch (requestError) {
      toast.error(requestError.message || "Could not update user role");
    }
  };

  const startEditing = (user) => {
    setEditingUserId(user._id);
    setUserEdits({ name: user.name, email: user.email });
  };

  const handleUpdateUser = async (user) => {
    try {
      await dispatch(updateUser({ id: user._id, ...userEdits })).unwrap();
      setEditingUserId(null);
      toast.success("User details updated");
    } catch (requestError) {
      toast.error(requestError.message || "Could not update user");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name}'s account? This cannot be undone.`)) return;
    try {
      await dispatch(deleteUser(user._id)).unwrap();
      toast.success("User deleted");
    } catch (requestError) {
      toast.error(requestError.message || "Could not delete user");
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-8">
      <header>
        <p className="eyebrow mb-2">People / Accounts</p>
        <h1 className="display-title text-4xl sm:text-5xl">User management</h1>
        <p className="mt-3 text-sm text-[var(--ink-soft)]">
          {users.length} account{users.length === 1 ? "" : "s"} in your store.
        </p>
      </header>

      {error && (
        <div role="alert" className="border border-[#d9aaa0] bg-[#f7e9e5] p-4 text-sm text-[var(--error)]">
          {error}
        </div>
      )}

      <div className="premium-panel p-5 sm:p-8">
        <h2 className="display-title mb-6 text-3xl">Add an account</h2>
        <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">
            Name
            <input
              name="name"
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              className="premium-input mt-2 normal-case tracking-normal"
              autoComplete="name"
              required
            />
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              className="premium-input mt-2 normal-case tracking-normal"
              autoComplete="email"
              required
            />
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">
            Temporary password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              className="premium-input mt-2 normal-case tracking-normal"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">
            Role
            <select
              name="role"
              value={formData.role}
              onChange={(event) => setFormData({ ...formData, role: event.target.value })}
              className="premium-input mt-2 normal-case tracking-normal"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <div className="sm:col-span-2 sm:text-right">
            <button className="premium-button w-full sm:w-auto" type="submit" disabled={saving}>
              {saving ? "Saving…" : "Create user"}
            </button>
          </div>
        </form>
      </div>

      <div className="premium-panel overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-[var(--line)] p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
          <div>
            <h2 className="display-title text-3xl">Accounts</h2>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">Manage access and account roles.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[minmax(12rem,1fr)_10rem]">
            <input
              type="search"
              aria-label="Search users"
              placeholder="Search name or email"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="premium-input"
            />
            <select aria-label="Filter users by role" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="premium-input">
              <option value="all">All roles</option>
              <option value="admin">Admins</option>
              <option value="customer">Customers</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--paper)] text-xs uppercase tracking-wide text-[var(--ink-soft)]">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {loading ? (
                <tr><td colSpan="5" className="px-5 py-10 text-center text-[var(--ink-soft)]">Loading accounts…</td></tr>
              ) : filteredUsers.length ? (
                filteredUsers.map((user) => {
                  const isCurrentUser = user._id === currentUserId;
                  const isEditing = editingUserId === user._id;
                  return (
                    <tr key={user._id} className="hover:bg-[var(--paper)]">
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-[var(--ink)]">
                        {isEditing ? (
                          <input aria-label={`Name for ${user.name}`} value={userEdits.name} onChange={(event) => setUserEdits({ ...userEdits, name: event.target.value })} className="w-48 border border-[var(--line)] bg-[var(--surface-elevated)] px-2 py-2" required />
                        ) : user.name}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-[var(--ink-soft)]">
                        {isEditing ? (
                          <input type="email" aria-label={`Email for ${user.name}`} value={userEdits.email} onChange={(event) => setUserEdits({ ...userEdits, email: event.target.value })} className="w-56 border border-[var(--line)] bg-[var(--surface-elevated)] px-2 py-2" required />
                        ) : user.email}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          aria-label={`Role for ${user.name}`}
                          value={user.role}
                          onChange={(event) => handleRoleChange(user, event.target.value)}
                          disabled={isCurrentUser || saving}
                          className="border border-[var(--line)] bg-[var(--surface-elevated)] px-3 py-2 disabled:opacity-60"
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-[var(--ink-soft)]">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <button type="button" onClick={() => handleUpdateUser(user)} disabled={saving || !userEdits.name.trim() || !userEdits.email.trim()} className="border border-[var(--bronze)] px-3 py-2 text-xs font-semibold disabled:opacity-50">
                                {saving ? "Saving…" : "Save"}
                              </button>
                              <button type="button" onClick={() => setEditingUserId(null)} disabled={saving} className="border border-[var(--line)] px-3 py-2 text-xs font-semibold">Cancel</button>
                            </>
                          ) : (
                            <>
                              <button type="button" onClick={() => startEditing(user)} className="border border-[var(--line)] px-3 py-2 text-xs font-semibold transition hover:border-[var(--bronze)]">Edit</button>
                              <button
                                type="button"
                                onClick={() => handleDelete(user)}
                                disabled={isCurrentUser || deletingId === user._id}
                                className="border border-[var(--error)] px-3 py-2 text-xs font-semibold text-[var(--error)] transition hover:bg-[var(--error)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {deletingId === user._id ? "Deleting…" : isCurrentUser ? "You" : "Delete"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="5" className="px-5 py-10 text-center text-[var(--ink-soft)]">No matching accounts found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default UserManagement;
