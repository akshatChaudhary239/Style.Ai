import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Product =
  Database["public"]["Tables"]["products"]["Row"];

export default function ProductList({
  onClose,
  onCreate,
  onEdit,
  onStatusChange,
}: {
  onClose: () => void;
  onCreate: () => void;
  onEdit: (product: Product) => void;
  onStatusChange: () => void;
}) {



  async function toggleStatus(product: Product) {
  const newStatus = product.status === "draft" ? "active" : "draft";

  const { error } = await supabase
    .from("products")
    .update({ status: newStatus })
    .eq("id", product.id);

  if (error) {
    alert(error.message);
    return;
  }

  fetchProducts();      // refresh product list
  onStatusChange();     // refresh slot counts
}
async function deleteProduct(product: Product) {
  const confirmDelete = window.confirm(
    `Delete "${product.name}"? This action cannot be undone.`
  );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", product.id);

  if (error) {
    alert(error.message);
    return;
  }

  fetchProducts();   // refresh list
  onStatusChange();  // refresh slots (important if active)
}



  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(
        data.map((p) => ({
          ...p,
          status: p.status as "draft" | "active",
        }))
      );
    }

    setLoading(false);
  }

  if (loading) return <p>Loading products...</p>;

return (
  <div className="w-full">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h2 className="text-2xl font-semibold">Your Products</h2>

      <button
        onClick={onCreate}
        className="w-full sm:w-auto mr-3 px-5 py-2 bg-primary text-primary-foreground rounded-lg shadow hover:opacity-90 transition"
      >
        + Add Product
      </button>
    </div>

    {/* Empty State */}
    {products.length === 0 && (
      <div className="flex flex-col items-center justify-center py-20 border rounded-xl bg-muted/30 text-center">
        <p className="text-lg font-medium mb-2">No products yet</p>
        <p className="text-sm text-muted-foreground mb-6 max-w-xs">
          Upload your first product to start appearing in buyer recommendations
        </p>

        <button
          onClick={onCreate}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg shadow"
        >
          Upload Product
        </button>
      </div>
    )}

    {/* Product Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-xl p-4 bg-background shadow-sm hover:shadow-md transition"
        >
          {/* Image */}
          <div className="w-full h-40 rounded-lg overflow-hidden bg-muted mb-4">
            {product.image_urls?.[0] ? (
              <img
                src={product.image_urls[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                No Image
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <p className="font-medium leading-tight">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                {product.category || "No category"}
              </p>
            </div>

            {/* Status Badge */}
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                product.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {product.status === "active" ? "Active" : "Draft"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 border rounded-lg py-1.5 text-sm hover:bg-muted transition"
              >
                Edit
              </button>

              <button
                onClick={() => toggleStatus(product)}
                className={`flex-1 rounded-lg py-1.5 text-sm text-white transition ${
                  product.status === "draft"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }`}
              >
                {product.status === "draft" ? "Publish" : "Unpublish"}
              </button>
            </div>

            <button
              onClick={() => deleteProduct(product)}
              className="w-full text-sm py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

}
