import { useState } from "react";

const UserManagement = () => {
  const users = [
    {
      _id: 1,
      name: "Shah Nawaz",
      email: "shah@gmail.com",
      password: "12345678",
      role: "admin",
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // You can add functionality to actually add the user
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer",
    });
  };

  const handleRoleChange = (userId, newRole) => {
    console.log({ id: userId, role: newRole });
  };
  const handleDeleteUSer = (userId) =>{
    if(window.confirm("Are you Sure you want to delete this User?")){
        console.log("Delecting  user with id", userId);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="display-title mb-8 text-center text-5xl">
        User Management
      </h2>

      {/* Add user Form */}
      <div className="premium-panel mb-12 p-8">
        <h3 className="display-title mb-6 text-3xl">
          Add New User
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="premium-input"
              placeholder="Enter Name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="premium-input"
              placeholder="Enter Email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="premium-input"
              placeholder="Enter Password"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="premium-input"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="premium-button"
            >
              Add User
            </button>
          </div>
        </form>
      </div>

      {/* User List */}
      <div className="premium-panel overflow-x-auto p-8">
        <h3 className="display-title mb-6 text-3xl">
          Users List
        </h3>
        <table className="min-w-full table-auto">
          <thead className="border-y border-[var(--line)]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--ink-soft)]">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--ink-soft)]">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--ink-soft)]">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--ink-soft)]">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-[var(--line)] hover:bg-[var(--paper)]">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="border border-[var(--line)] bg-[var(--surface-elevated)] p-2 focus:border-[var(--bronze)] focus:outline-none"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                  onClick={()=>handleDeleteUSer(user._id)}
                    className="bg-[var(--error)] px-4 py-2 text-sm text-white transition duration-300 hover:bg-[#873d35]"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
