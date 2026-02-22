import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { motion, AnimatePresence } from "framer-motion";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function ProductList({
  onCreate,
  onEdit,
  onStatusChange,
}: {
  onClose: () => void;
  onCreate: () => void;
  onEdit: (product: Product) => void;
  onStatusChange: () => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data.map((p) => ({ ...p, status: p.status as "draft" | "active" })));
    }
    setLoading(false);
  }

  async function toggleStatus(product: Product) {
    const newStatus = product.status === "draft" ? "active" : "draft";
    const { error } = await supabase
      .from("products")
      .update({ status: newStatus })
      .eq("id", product.id);

    if (!error) {
      fetchProducts();
      onStatusChange();
    }
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`PERMANENT DELETION: Are you sure you wish to remove "${product.name}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (!error) {
      fetchProducts();
      onStatusChange();
    }
  }

  if (loading) return (
    <div className="py-20 text-center">
      <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-20">Refreshing Local Buffer</p>
    </div>
  );

  return (
    <div className="w-full">
      {/* Empty State */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40 border border-dashed border-black/10 text-center">
          <p className="text-sm font-black tracking-widest uppercase mb-8">No Assets Registered</p>
          <button
            onClick={onCreate}
            className="px-10 py-4 bg-black text-white text-[10px] font-black tracking-[0.4em] uppercase hover:bg-black/90 transition-all"
          >
            Deploy First Asset
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
        {products.map((product) => (
          <div key={product.id} className="group">
            {/* Image Wrap */}
            <div className="relative aspect-[4/5] bg-gray-50 border border-black/5 overflow-hidden mb-6">
              {product.image_urls?.[0] ? (
                <img
                  src={product.image_urls[0]}
                  alt={product.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-[10px] uppercase tracking-widest font-black text-black/20">
                  No Optical Data
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-6 left-6">
                <span className={`text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1.5 border ${product.status === "active" ? "bg-black text-white border-black" : "bg-white text-black border-black/10"
                  }`}>
                  {product.status}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-display font-bold uppercase tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                  {product.name}
                </h3>
                <p className="text-[10px] font-black tracking-widest text-black/40 uppercase mt-1">
                  ID: {product.id.slice(0, 8)} / {product.category || "UNCLASSIFIED"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => onEdit(product)}
                  className="px-6 py-2 border border-black text-[9px] font-black tracking-widest uppercase hover:bg-black hover:text-white transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleStatus(product)}
                  className={`px-6 py-2 text-[9px] font-black tracking-widest uppercase border transition-all ${product.status === "draft"
                      ? "border-black bg-black text-white hover:bg-black/80"
                      : "border-black text-black hover:bg-black hover:text-white"
                    }`}
                >
                  {product.status === "draft" ? "Activate" : "Deactivate"}
                </button>
                <button
                  onClick={() => deleteProduct(product)}
                  className="px-6 py-2 border border-red-600/20 text-red-600/40 hover:text-red-600 hover:border-red-600 text-[9px] font-black tracking-widest uppercase transition-all"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
