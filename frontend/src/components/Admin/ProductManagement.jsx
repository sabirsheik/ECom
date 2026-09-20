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
      <h2 className="display-title mb-8 text-center text-5xl">
        Product Management
      </h2>

      <div className="premium-panel overflow-x-auto">
        <table className="min-w-full text-left text-sm text-[var(--ink-soft)]">
          <thead className="border-b border-[var(--line)] text-xs uppercase tracking-wider text-[var(--ink-soft)]">
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
                  className="border-b border-[var(--line)] transition duration-150 hover:bg-[var(--paper)]"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-[var(--ink)]">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 font-semibold text-[var(--ink)]">
                    Rs. {product.price}
                  </td>
                  <td className="px-6 py-4">{product.sku}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="w-full bg-[var(--bronze)] px-4 py-2 text-center text-sm font-medium text-[var(--graphite)] transition hover:bg-[var(--bronze-deep)] hover:text-white sm:w-auto"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="w-full bg-[var(--error)] px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-[#873d35] sm:w-auto"
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
                  className="px-6 py-4 text-center text-[var(--ink-soft)]"
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
