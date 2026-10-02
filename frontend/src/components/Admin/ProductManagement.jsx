import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { deleteProduct, fetchAdminProducts } from "../../redux/slices/adminProductSlice";

const currency = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
});

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, deletingId, error } = useSelector((state) => state.adminProduct);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        !query ||
        product.name?.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query);
      const stock = Number(product.countInStock || 0);
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "low" && stock > 0 && stock <= 5) ||
        (stockFilter === "out" && stock === 0) ||
        (stockFilter === "available" && stock > 0);
      return matchesQuery && matchesStock;
    });
  }, [products, search, stockFilter]);

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}" from the catalog? This cannot be undone.`)) return;
    try {
      await dispatch(deleteProduct(product._id)).unwrap();
      toast.success("Product deleted");
    } catch (requestError) {
      toast.error(requestError.message || "Could not delete product");
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-7">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2">Catalog / Inventory</p>
          <h1 className="display-title text-4xl sm:text-5xl">Products</h1>
          <p className="mt-3 text-sm text-[var(--ink-soft)]">
            {products.length} products · {products.filter((item) => Number(item.countInStock || 0) <= 5).length} low or out of stock
          </p>
        </div>
        <Link to="/admin/products/new" className="premium-button text-center">Add product</Link>
      </header>

      {error && (
        <div role="alert" className="border border-[#d9aaa0] bg-[#f7e9e5] p-4 text-sm text-[var(--error)]">{error}</div>
      )}

      <div className="premium-panel overflow-hidden">
        <div className="grid gap-3 border-b border-[var(--line)] p-5 sm:grid-cols-[minmax(15rem,1fr)_12rem] sm:p-6">
          <input
            type="search"
            aria-label="Search products"
            placeholder="Search name, SKU or category"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="premium-input"
          />
          <select aria-label="Filter inventory" value={stockFilter} onChange={(event) => setStockFilter(event.target.value)} className="premium-input">
            <option value="all">All inventory</option>
            <option value="available">In stock</option>
            <option value="low">Low stock (1–5)</option>
            <option value="out">Out of stock</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--paper)] text-xs uppercase tracking-wide text-[var(--ink-soft)]">
              <tr>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">SKU / Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Inventory</th>
                <th className="px-5 py-4">Visibility</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {loading ? (
                <tr><td colSpan="6" className="px-5 py-10 text-center text-[var(--ink-soft)]">Loading catalog…</td></tr>
              ) : filteredProducts.length ? (
                filteredProducts.map((product) => {
                  const stock = Number(product.countInStock || 0);
                  return (
                    <tr key={product._id} className="hover:bg-[var(--paper)]">
                      <td className="min-w-[15rem] px-5 py-4">
                        <div className="flex items-center gap-3">
                          {product.images?.[0]?.url ? (
                            <img src={product.images[0].url} alt={product.images[0].altText || product.name} className="h-12 w-12 rounded-sm object-cover" />
                          ) : (
                            <div aria-hidden="true" className="h-12 w-12 bg-[var(--paper)]" />
                          )}
                          <span className="font-medium text-[var(--ink)]">{product.name}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-[var(--ink-soft)]">
                        <div>{product.sku}</div><div className="mt-1 text-xs">{product.category}</div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-[var(--ink)]">{currency.format(product.price || 0)}</td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className={stock <= 5 ? "font-semibold text-[var(--error)]" : "text-[var(--ink)]"}>
                          {stock} {stock === 1 ? "unit" : "units"}
                        </span>
                        {stock <= 5 && <span className="ml-2 text-xs text-[var(--error)]">{stock ? "Low" : "Out"}</span>}
                      </td>
                      <td className="px-5 py-4 text-[var(--ink-soft)]">{product.isPublished ? "Published" : "Draft"}</td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/admin/products/${product._id}/edit`} className="border border-[var(--line)] px-3 py-2 text-xs font-semibold transition hover:border-[var(--bronze)]">Edit</Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            disabled={deletingId === product._id}
                            className="border border-[var(--error)] px-3 py-2 text-xs font-semibold text-[var(--error)] transition hover:bg-[var(--error)] hover:text-white disabled:opacity-50"
                          >
                            {deletingId === product._id ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="6" className="px-5 py-10 text-center text-[var(--ink-soft)]">No matching products. Add a product to begin managing inventory.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ProductManagement;
