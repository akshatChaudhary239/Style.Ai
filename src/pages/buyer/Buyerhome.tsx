import { motion } from "framer-motion";
import { useStyleContext } from "@/context/StyleContext";
import ContextBadge from "./ContextBadge";
import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function BuyerHome() {
  const {
    draftContext,
    appliedContext,
    setDraftContext,
    applyContext,
  } = useStyleContext();

  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal-item", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const MOCK_PRODUCTS = [
    {
      id: 1,
      name: "Architectural Kurta",
      occasion: "wedding",
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
      price: "₹8,500"
    },
    {
      id: 2,
      name: "Structured Boxy Tee",
      occasion: "casual",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
      price: "₹2,200"
    },
    {
      id: 3,
      name: "Minimalist Poplin Shirt",
      occasion: "office",
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?q=80&w=800&auto=format&fit=crop",
      price: "₹4,800"
    },
  ];

  const visibleProducts = appliedContext.occasion
    ? MOCK_PRODUCTS.filter(
      (p) => p.occasion === appliedContext.occasion
    )
    : MOCK_PRODUCTS;

  return (
    <div ref={containerRef} className="w-full space-y-24 py-10">
      {/* HERO SECTION */}
      <section className="reveal-item space-y-4">
        <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-display">Overview / Portal</p>
        <h1 className="text-6xl md:text-7xl font-display font-black tracking-tighter uppercase leading-[0.8] mix-blend-difference">
          Welcome back <br />
          <span className="text-black/20">to Style.AI</span>
        </h1>
        <p className="text-lg text-black/60 max-w-xl font-light leading-relaxed pt-4">
          Precision analytics meet high fashion. Explore your daily curations, selected specifically for your current intent.
        </p>
      </section>

      {/* Context Badges (Subtle) */}
      <div className="reveal-item">
        <ContextBadge
          draftContext={draftContext}
          appliedContext={appliedContext}
          onApply={applyContext}
          onEdit={() => {
            setDraftContext({ occasion: "wedding" }); // TEMP
          }}
        />
      </div>

      {/* RECOMMENDED SECTON */}
      <section className="space-y-12">
        <div className="reveal-item flex justify-between items-end border-b border-black pb-4">
          <h2 className="text-2xl font-display font-bold uppercase tracking-tighter">
            Curated Recommendations
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-black/40">Showing {visibleProducts.length} Selections</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
          {visibleProducts.map((product, index) => (
            <div
              key={product.id}
              className="reveal-item group cursor-pointer"
            >
              {/* Image with Hover Effect */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6 grayscale group-hover:grayscale-0 transition-all duration-700 ease-out">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-white/90 backdrop-blur-md">
                  <button className="w-full py-3 bg-black text-white text-[10px] uppercase tracking-widest font-bold">
                    View Details
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2 px-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-display font-bold uppercase tracking-tight leading-none group-hover:translate-x-1 transition-transform duration-300">
                    {product.name}
                  </h3>
                  <span className="text-sm font-light text-black/60">{product.price}</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-black/40">
                  Ideal for {product.occasion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RECENTLY LIKED */}
      <section className="space-y-12 reveal-item">
        <div className="flex justify-between items-end border-b border-black/10 pb-4">
          <h2 className="text-xl font-display font-bold uppercase tracking-tighter">
            Recently Liked
          </h2>
          <button className="text-[10px] uppercase tracking-widest text-black hover:underline underline-offset-4">See Favorites</button>
        </div>

        <div className="flex gap-12 overflow-x-auto pb-10 -mx-4 px-4 no-scrollbar">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[200px] group cursor-pointer"
            >
              <div className="aspect-square bg-gray-50 border border-black/5 mb-4 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                <div className="w-full h-full bg-slate-200 group-hover:scale-110 transition-transform duration-700" />
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-black/80">
                Item No. 00{i + 1}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
