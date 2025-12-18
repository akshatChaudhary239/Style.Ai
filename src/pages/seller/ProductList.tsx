import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Product = {
  id: string;
  name: string;
  category: string | null;
  status: "draft" | "active";
  image_urls: string[];
};

export default function ProductList() {
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
      .select("id, name, category, status, image_urls")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  }

  async function toggleStatus(product: Product) {
    const newStatus = product.status === "draft" ? "active" : "draft";

    const { error } = await supabase
      .from("products")
      .update({ status: newStatus })
      .eq("id", product.id);

    if (error) {
      alert(error.message);
    } else {
      fetchProducts(); // re-sync slot logic
    }
  }

  async function deleteProduct(id: string) {
    const confirmed = confirm("Delete this product?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
    } else {
      fetchProducts();
    }
  }

  if (loading) return <p>Loading products...</p>;

  if (products.length === 0) {
    return <p>No products yet. Create one.</p>;
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex items-center gap-4 border p-3 rounded"
        >
          {/* Image */}
          <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
            {product.image_urls?.[0] ? (
              <img
                src={product.image_urls[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-500">
              {product.category || "No category"}
            </p>
            <span
              className={`text-xs font-medium ${
                product.status === "active"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {product.status.toUpperCase()}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => toggleStatus(product)}
              className="text-sm px-3 py-1 border rounded"
            >
              {product.status === "draft" ? "Publish" : "Unpublish"}
            </button>

            <button
              onClick={() => deleteProduct(product.id)}
              className="text-sm px-3 py-1 border text-red-600 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
