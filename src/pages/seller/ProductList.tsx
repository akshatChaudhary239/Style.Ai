import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Product =
  Database["public"]["Tables"]["products"]["Row"];

export default function ProductList({
  onClose,
}: {
  onClose: () => void;
}) {
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
      <h2 className="text-xl font-semibold mb-6">Your Products</h2>

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
      onClick={() => {
        // next step: switch to upload panel
        alert("Upload panel coming next");
      }}
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

            <div className="flex-1">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                {product.category || "No category"}
              </p>
              <span className="text-xs">
                {product.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
