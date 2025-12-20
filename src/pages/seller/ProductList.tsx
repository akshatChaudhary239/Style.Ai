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
    <div>
<div className="flex items-center justify-between mb-6">
  <h2 className="text-xl font-semibold">Your Products</h2>

  <button
    onClick={onCreate}
    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
  >
    + Add Product
  </button>
</div>


{products.length === 0 && (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <p className="text-lg font-medium mb-2">
      No products yet
    </p>
    <p className="text-sm text-muted-foreground mb-6">
      Start by uploading your first product
    </p>

<button
  className="px-5 py-2 bg-primary text-primary-foreground rounded-lg"
  onClick={onCreate}
>
  + Upload Product
</button>

  </div>
)}


      <div className="space-y-4">
        {products.map((product) => (
<div
  key={product.id}
  className="flex items-center gap-4 border p-3 rounded-lg"
>
  {/* Image */}
  <div className="w-20 h-20 bg-muted rounded overflow-hidden">
    {product.image_urls?.[0] ? (
      <img
        src={product.image_urls[0]}
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
        No Image
      </div>
    )}
  </div>

  {/* Info */}
  <div className="flex-1">
    <p className="font-medium">{product.name}</p>
    <p className="text-sm text-muted-foreground">
      {product.category || "No category"}
    </p>
    <span className="text-xs">
      {product.status.toUpperCase()}
    </span>
  </div>

  {/* ACTION BUTTONS ← THIS IS WHAT WAS MISSING */}
<div className="flex gap-2">
  <button
    onClick={() => onEdit(product)}
    className="px-3 py-1 text-sm border rounded"
  >
    Edit
  </button>

  <button
    onClick={() => toggleStatus(product)}
    className={`px-3 py-1 text-sm rounded ${
      product.status === "draft"
        ? "bg-green-600 text-white"
        : "bg-yellow-500 text-white"
    }`}
  >
    {product.status === "draft" ? "Publish" : "Unpublish"}
  </button>

  <button
    onClick={() => deleteProduct(product)}
    className="px-3 py-1 text-sm bg-red-600 text-white rounded"
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
