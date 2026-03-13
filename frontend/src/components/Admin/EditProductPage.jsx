import React, { useState } from "react";

const EditProductPage = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    countInStock: "",
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    metrail: "",
    gender: "",
    image: [
      {
        url: "https://picsum.photos/500/500?random=3",
        alt: "productImg1",
      },
      {
        url: "https://picsum.photos/500/500?random=4",
        alt: "productImg2",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    console.log(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(productData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10 tracking-tight">
          Edit Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleChange}
              rows={4}
              className="input-field"
              placeholder="Enter product description"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Count In Stock</label>
              <input
                type="number"
                name="countInStock"
                value={productData.countInStock}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                name="sku"
                value={productData.sku}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma-separated)</label>
              <input
                type="text"
                name="sizes"
                value={productData.sizes.join(", ")}
                onChange={(e) =>
                  setProductData({ ...productData, sizes: e.target.value.split(",").map((s) => s.trim()) })
                }
                className="input-field"
                placeholder="e.g. S, M, L"
                required
              />
            </div>

            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma-separated)</label>
              <input
                type="text"
                name="colors"
                value={productData.colors.join(", ")}
                onChange={(e) =>
                  setProductData({ ...productData, colors: e.target.value.split(",").map((c) => c.trim()) })
                }
                className="input-field"
                placeholder="e.g. red, blue"
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
            <input type="file" name="image" onChange={handleImageUpload} className="mb-4" />
            <div className="flex gap-4 flex-wrap">
              {productData.image.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={img.alt}
                  className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 transform hover:scale-105"
          >
            Update Product
          </button>
        </form>
      </div>

      {/* Custom animation */}
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
        `}
      </style>

      {/* Custom Tailwind-like input styling */}
      <style>
        {`
          .input-field {
            width: 100%;
            padding: 0.75rem;
            background-color: #f9fafb;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: border 0.2s, box-shadow 0.2s;
          }
          .input-field:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
          }
        `}
      </style>
    </div>
  );
};

export default EditProductPage;
