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
    <div className="min-h-screen bg-[var(--paper)] px-4 py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="premium-panel mx-auto max-w-4xl p-10">
        <p className="eyebrow mb-3 text-center">Catalog / Product</p>
        <h2 className="display-title mb-10 text-center text-5xl">
          Edit Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="mb-1 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">Product Name</label>
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
            <label className="mb-1 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">Description</label>
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
              <label className="mb-1 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">Price</label>
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
              <label className="mb-1 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">Count In Stock</label>
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
              <label className="mb-1 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">SKU</label>
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
              <label className="mb-1 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">Sizes (comma-separated)</label>
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
              <label className="mb-1 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">Colors (comma-separated)</label>
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
            <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">Upload Image</label>
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
            className="premium-button w-full"
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
