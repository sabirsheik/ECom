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
      <h2 className="text-3xl font-bold mb-8 text-center text-e-black">
        User Management
      </h2>

      {/* Add user Form */}
      <div className="bg-white p-8 rounded-xl shadow-lg mb-12">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">
          Add New User
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-gray-600 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-e-hover focus:outline-none"
              placeholder="Enter Name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-e-hover focus:outline-none"
              placeholder="Enter Email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-e-hover focus:outline-none"
              placeholder="Enter Password"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-gray-600 mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-e-hover focus:outline-none"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-green-400 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition duration-300"
            >
              Add User
            </button>
          </div>
        </form>
      </div>

      {/* User List */}
      <div className="overflow-x-auto bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">
          Users List
        </h3>
        <table className="min-w-full table-auto">
          <thead className="bg-indigo-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="p-2 rounded-lg border focus:ring-2 focus:ring-e-hover focus:outline-none"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                  onClick={()=>handleDeleteUSer(user._id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm transition duration-300"
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
