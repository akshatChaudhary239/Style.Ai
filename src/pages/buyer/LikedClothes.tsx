import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RecommendationDetail from "./RecommendationDetail";
import { Product } from "@/recommendation/types";
import gsap from "gsap";

const MOCK_LIKED: Product[] = [
  {
    id: "1",
    name: "ARCHITECTURAL KURTA",
    category: "ethnic",
    colors: ["cream"],
    sizes: ["M", "L"],
    seller_id: "seller-1",
  },
  {
    id: "2",
    name: "STRUCTURED OVERSIZED TEE",
    category: "casual",
    colors: ["black"],
    sizes: ["L"],
    seller_id: "seller-2",
  },
];

export default function LikedClothes() {
  const [selected, setSelected] = useState<Product | null>(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal-item", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full space-y-16 py-10">
      {/* Header */}
      <section className="reveal-item space-y-4">
        <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-display">Identity / Archive</p>
        <h1 className="text-6xl md:text-7xl font-display font-black tracking-tighter uppercase leading-none">
          Saved <br />
          <span className="text-black/10">Aesthetics</span>
        </h1>
        <p className="text-lg text-black/60 max-w-xl font-light leading-relaxed">
          Your personal collection of approved silhouettes and curated textures.
        </p>
      </section>

      {/* Empty State */}
      {MOCK_LIKED.length === 0 && (
        <section className="reveal-item text-center py-40 border border-dashed border-black/10">
          <p className="text-sm uppercase tracking-widest text-black/40 font-black">
            Archive Empty — Start Exploring
          </p>
        </section>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
        {MOCK_LIKED.map((product) => (
          <div
            key={product.id}
            onClick={() => setSelected(product)}
            className="reveal-item group cursor-pointer"
          >
            {/* Image Placeholder */}
            <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-6">
              <div className="w-full h-full bg-slate-200 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-6 right-6">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-black text-xs">❤️</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-lg font-display font-bold uppercase tracking-tight leading-none group-hover:translate-x-1 transition-transform duration-300">
                {product.name}
              </h3>
              <p className="text-[10px] uppercase tracking-widest text-black/40 underline underline-offset-4 decoration-black/10">
                Category: 0{product.category}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Model */}
      <AnimatePresence>
        {selected && (
          <RecommendationDetail
            productId={selected.id}
            productName={selected.name}
            confidence="medium"
            opinion="RE-EVALUATED: Still aligns with your current style parameters."
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
