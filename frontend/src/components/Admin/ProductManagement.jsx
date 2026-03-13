import React from "react";
import { Link } from "react-router-dom";

const ProductManagement = () => {
  const products = [
    {
      _id: 11223,
      name: "Shirt",
      price: 4999,
      sku: "123123123",
    },
    {
      _id: 11224,
      name: "Jeans",
      price: 2999,
      sku: "123123124",
    },
    {
      _id: 11225,
      name: "Jacket",
      price: 7999,
      sku: "123123125",
    },
    {
      _id: 11226,
      name: "Sneakers",
      price: 5999,
      sku: "123123126",
    },
    {
      _id: 11227,
      name: "Watch",
      price: 3499,
      sku: "123123127",
    },
  ];
  

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      console.log("Delete Product with id:", id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Product Management
      </h2>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-xs text-gray-700 uppercase tracking-wider">
            <tr>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Price</th>
              <th className="py-4 px-6">SKU</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-700">
                    Rs. {product.price}
                  </td>
                  <td className="px-6 py-4">{product.sku}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="w-full sm:w-auto text-center px-4 py-2 text-sm font-medium text-white bg-yellow-400 hover:bg-yellow-500 rounded transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="w-full sm:w-auto text-center px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
