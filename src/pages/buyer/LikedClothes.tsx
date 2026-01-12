import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RecommendationDetail from "@/pages/buyer/RecommendationDetail";
import { Product } from "@/recommendation/types";

/* TEMP MOCK will replace it with Supabase later */
const MOCK_LIKED: Product[] = [
  {
    id: "1",
    name: "Traditional Kurta Set",
    category: "ethnic",
    colors: ["cream"],
    sizes: ["M", "L"],
    seller_id: "seller-1",
  },
  {
    id: "2",
    name: "Casual Oversized Tee",
    category: "casual",
    colors: ["black"],
    sizes: ["L"],
    seller_id: "seller-2",
  },
];

export default function LikedClothes() {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Liked clothes
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Everything you saved, in one place.
        </p>
      </motion.div>

      {/* Empty State */}
      {MOCK_LIKED.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-gray-500"
        >
          <p className="text-lg font-medium">
            You haven’t liked anything yet
          </p>
          <p className="text-sm mt-2">
            Tap the heart on products you love — they’ll show up here.
          </p>
        </motion.div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {MOCK_LIKED.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected(product)}
            className="
              cursor-pointer
              rounded-xl
              border
              bg-white
              shadow-sm
              hover:shadow-md
              transition
              overflow-hidden
            "
          >
            {/* Image Placeholder */}
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200" />

            {/* Minimal Info */}
            <div className="p-2">
              <p className="text-sm font-medium text-gray-900 truncate">
                {product.name}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Model */}
      <AnimatePresence>
        {selected && (
          <RecommendationDetail
            productId={selected.id}
            productName={selected.name}
            confidence="medium"
            opinion="You liked this earlier — here’s why it still works."
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
