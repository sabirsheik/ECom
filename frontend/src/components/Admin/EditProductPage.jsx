import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { adminRequest } from "../../redux/adminApi";
import {
  createProduct,
  fetchAdminProduct,
  updateProduct,
} from "../../redux/slices/adminProductSlice";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  countInStock: "0",
  sku: "",
  category: "",
  brand: "",
  sizesText: "",
  colorsText: "",
  collections: "",
  material: "",
  gender: "",
  tagsText: "",
  images: [],
  isFeatured: false,
  isPublished: false,
};

const splitValues = (value) =>
  value.split(",").map((item) => item.trim()).filter(Boolean);

const productToForm = (product) => ({
  ...emptyProduct,
  ...product,
  price: product.price ?? "",
  discountPrice: product.discountPrice ?? "",
  countInStock: product.countInStock ?? "0",
  sizesText: (product.sizes || []).join(", "),
  colorsText: (product.colors || []).join(", "),
  tagsText: (product.tags || []).join(", "),
  images: product.images || [],
});

const EditProductPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const saving = useSelector((state) => state.adminProduct.saving);
  const [productData, setProductData] = useState(emptyProduct);
  const [loading, setLoading] = useState(isEditing);
  const [uploading, setUploading] = useState(false);
  const [pageError, setPageError] = useState(null);

  useEffect(() => {
    if (!isEditing) {
      setProductData(emptyProduct);
      setLoading(false);
      return;
    }

    let active = true;
    dispatch(fetchAdminProduct(id))
      .unwrap()
      .then((product) => {
        if (active) setProductData(productToForm(product));
      })
      .catch((error) => {
        if (active) setPageError(error.message || "Could not load this product");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [dispatch, id, isEditing]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setProductData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setPageError(null);
    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const body = new FormData();
          body.append("image", file);
          const result = await adminRequest({
            method: "post",
            url: "/api/upload",
            data: body,
          });
          return { url: result.imageUrl, altText: file.name };
        })
      );
      setProductData((current) => ({
        ...current,
        images: [...current.images, ...uploadedImages],
      }));
      toast.success(`${uploadedImages.length} image${uploadedImages.length === 1 ? "" : "s"} uploaded`);
    } catch (error) {
      setPageError(error.response?.data?.message || error.message || "Image upload failed");
      toast.error(error.response?.data?.message || error.message || "Image upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPageError(null);
    const payload = {
      name: productData.name.trim(),
      description: productData.description.trim(),
      price: Number(productData.price),
      discountPrice: productData.discountPrice === "" ? null : Number(productData.discountPrice),
      countInStock: Number(productData.countInStock),
      sku: productData.sku.trim(),
      category: productData.category.trim(),
      brand: productData.brand.trim(),
      sizes: splitValues(productData.sizesText),
      colors: splitValues(productData.colorsText),
      collections: productData.collections.trim(),
      material: productData.material.trim(),
      gender: productData.gender || undefined,
      tags: splitValues(productData.tagsText),
      images: productData.images,
      isFeatured: productData.isFeatured,
      isPublished: productData.isPublished,
    };

    try {
      if (isEditing) {
        await dispatch(updateProduct({ id, productData: payload })).unwrap();
        toast.success("Product updated");
      } else {
        await dispatch(createProduct(payload)).unwrap();
        toast.success("Product created");
      }
      navigate("/admin/products");
    } catch (error) {
      setPageError(error.message || "Could not save the product");
      toast.error(error.message || "Could not save the product");
    }
  };

  if (loading) {
    return <div role="status" className="py-16 text-center text-[var(--ink-soft)]">Loading product…</div>;
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2">Catalog / Product</p>
          <h1 className="display-title text-4xl sm:text-5xl">{isEditing ? "Edit product" : "Add product"}</h1>
        </div>
        <Link to="/admin/products" className="text-sm font-semibold text-[var(--bronze-deep)] hover:underline">Back to products</Link>
      </header>

      {pageError && (
        <div role="alert" className="border border-[#d9aaa0] bg-[#f7e9e5] p-4 text-sm text-[var(--error)]">
          {pageError}
          {isEditing && !productData._id && <p className="mt-2"><Link to="/admin/products" className="underline">Return to product list</Link></p>}
        </div>
      )}

      <form onSubmit={handleSubmit} className="premium-panel space-y-7 p-5 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] sm:col-span-2">
            Product name
            <input name="name" value={productData.name} onChange={handleChange} className="premium-input mt-2 normal-case tracking-normal" required maxLength={160} />
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] sm:col-span-2">
            Description
            <textarea name="description" value={productData.description} onChange={handleChange} className="premium-input mt-2 min-h-28 normal-case tracking-normal" required />
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">
            Price (PKR)
            <input type="number" name="price" value={productData.price} onChange={handleChange} className="premium-input mt-2 normal-case tracking-normal" min="0" step="0.01" required />
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">
            Sale price (optional)
            <input type="number" name="discountPrice" value={productData.discountPrice} onChange={handleChange} className="premium-input mt-2 normal-case tracking-normal" min="0" step="0.01" />
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">
            Stock quantity
            <input type="number" name="countInStock" value={productData.countInStock} onChange={handleChange} className="premium-input mt-2 normal-case tracking-normal" min="0" step="1" required />
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">
            SKU
            <input name="sku" value={productData.sku} onChange={handleChange} className="premium-input mt-2 normal-case tracking-normal" required />
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">
            Category
            <input name="category" value={productData.category} onChange={handleChange} className="premium-input mt-2 normal-case tracking-normal" required />
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">
            Collection
            <input name="collections" value={productData.collections} onChange={handleChange} className="premium-input mt-2 normal-case tracking-normal" required />
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">
            Brand
            <input name="brand" value={productData.brand} onChange={handleChange} className="premium-input mt-2 normal-case tracking-normal" />
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">
            Material
            <input name="material" value={productData.material} onChange={handleChange} className="premium-input mt-2 normal-case tracking-normal" />
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">
            Gender
            <select name="gender" value={productData.gender || ""} onChange={handleChange} className="premium-input mt-2 normal-case tracking-normal">
              <option value="">Not specified</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">
            Sizes (comma separated)
            <input name="sizesText" value={productData.sizesText} onChange={handleChange} className="premium-input mt-2 normal-case tracking-normal" placeholder="S, M, L" required />
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">
            Colors (comma separated)
            <input name="colorsText" value={productData.colorsText} onChange={handleChange} className="premium-input mt-2 normal-case tracking-normal" placeholder="Black, Ivory" required />
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] sm:col-span-2">
            Tags (comma separated)
            <input name="tagsText" value={productData.tagsText} onChange={handleChange} className="premium-input mt-2 normal-case tracking-normal" placeholder="New season, Essentials" />
          </label>
        </div>

        <div className="border-t border-[var(--line)] pt-6">
          <label htmlFor="product-images" className="mb-3 block text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">Product images</label>
          <input id="product-images" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={handleImageUpload} disabled={uploading} className="block max-w-full text-sm text-[var(--ink-soft)] file:mr-4 file:border-0 file:bg-[var(--graphite)] file:px-4 file:py-2 file:text-white" />
          <p className="mt-2 text-xs text-[var(--ink-soft)]">JPEG, PNG, WebP or GIF · up to 5 MB each. Images upload securely before saving.</p>
          {uploading && <p role="status" className="mt-3 text-sm text-[var(--bronze-deep)]">Uploading images…</p>}
          {productData.images.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-3">
              {productData.images.map((image, index) => (
                <li key={`${image.url}-${index}`} className="relative">
                  <img src={image.url} alt={image.altText || `${productData.name || "Product"} image ${index + 1}`} className="h-24 w-24 rounded-sm object-cover" />
                  <button type="button" onClick={() => setProductData((current) => ({ ...current, images: current.images.filter((_, itemIndex) => itemIndex !== index) }))} aria-label={`Remove image ${index + 1}`} className="absolute -right-2 -top-2 rounded-full bg-[var(--error)] px-2 py-1 text-xs text-white">×</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            <label className="flex items-center gap-2 text-sm text-[var(--ink)]">
              <input type="checkbox" name="isFeatured" checked={productData.isFeatured} onChange={handleChange} />
              Featured product
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--ink)]">
              <input type="checkbox" name="isPublished" checked={productData.isPublished} onChange={handleChange} />
              Published in store
            </label>
          </div>
          <button type="submit" className="premium-button w-full sm:w-auto" disabled={saving || uploading || (isEditing && !productData._id)}>
            {uploading ? "Wait for uploads…" : saving ? "Saving…" : isEditing ? "Save changes" : "Create product"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditProductPage;
