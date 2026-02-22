import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useStyleContext } from "@/context/StyleContext";
import ContextBadge from "./ContextBadge";
import StylistChat from "@/components/StylistChat";
import gsap from "gsap";

import { recommendProducts } from "@/recommendation/recommendProducts";
import RecommendationDetail from "./RecommendationDetail";

type RecommendationItem = ReturnType<typeof recommendProducts>[number];

export default function Recommendations() {
  const { draftContext, appliedContext, applyContext } = useStyleContext();
  const [selectedRec, setSelectedRec] =
    useState<RecommendationItem | null>(null);

  const containerRef = useRef(null);
  const recommendations = recommendProducts([], appliedContext);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal-rec", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-24 py-10">
      {/* HEADER */}
      <section className="reveal-rec space-y-6 max-w-4xl">
        <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-display">Intelligence / Engine</p>
        <h1 className="text-7xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.8] text-black">
          Style.AI <br />
          <span className="text-black/10">Insights</span>
        </h1>
        <p className="text-xl text-black/60 font-light leading-relaxed max-w-2xl">
          Our recommendation engine decodes your aesthetic identity.
          By cross-referencing your profile with real-time trends, we've identified these strategic pieces.
        </p>
      </section>

      {/* INTENT SETTER (SYLIST CHAT) */}
      <div className="reveal-rec">
        <StylistChat />
      </div>

      {/* CONTEXT BADGE */}
      <div className="reveal-rec">
        <ContextBadge
          draftContext={draftContext}
          appliedContext={appliedContext}
          onApply={applyContext}
          onEdit={() => { }}
        />
      </div>

      {/* RESULTS */}
      <section className="space-y-12">
        <div className="reveal-rec flex justify-between items-end border-b border-black pb-4">
          <h2 className="text-2xl font-display font-bold uppercase tracking-tighter">
            Analytical Matches
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-black/40">Evaluation Complete</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {recommendations.map((rec, index) => (
            <div
              key={rec.product.id}
              onClick={() => setSelectedRec(rec)}
              className="reveal-rec group relative cursor-pointer bg-white border border-black/5 p-10 hover:border-black/20 transition-all duration-500 overflow-hidden"
            >
              {/* Background Number */}
              <span className="absolute -top-10 -right-4 text-[12rem] font-display font-black text-black/[0.02] select-none group-hover:text-black/[0.05] transition-colors duration-500">
                0{index + 1}
              </span>

              {/* Confidence Indicator */}
              <div className="flex items-center gap-2 mb-8">
                <div className={`w-2 h-2 rounded-full ${rec.confidence === "high" ? "bg-black" : "bg-black/30"
                  }`} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                  {rec.confidence} Confidence Ranking
                </span>
              </div>

              {/* Product Info */}
              <div className="space-y-6 relative z-10">
                <h3 className="text-4xl font-display font-bold uppercase tracking-tighter leading-none group-hover:translate-x-2 transition-transform duration-500">
                  {rec.product.name}
                </h3>

                <div className="space-y-3 pt-4 border-t border-black/10">
                  <p className="text-[10px] uppercase tracking-widest text-black/40 mb-4">Strategic Rationale</p>
                  {rec.reasons.slice(0, 3).map((reason, i) => (
                    <p
                      key={i}
                      className="text-sm text-black/60 font-light flex items-start gap-4"
                    >
                      <span className="w-1.5 h-1.5 bg-black/10 mt-1.5 flex-shrink-0" />
                      {reason}
                    </p>
                  ))}
                </div>

                <p className="text-lg text-black/80 font-light italic leading-relaxed pt-4 border-t border-black/5">
                  “{rec.opinion}”
                </p>

                <div className="pt-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black border-b border-black pb-2 group-hover:pr-4 transition-all duration-300">
                    View Full Analysis
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EMPTY STATE */}
      {recommendations.length === 0 && (
        <div className="reveal-rec text-center py-40 bg-black/5 border border-dashed border-black/10">
          <h3 className="text-2xl font-display font-bold uppercase tracking-tighter">
            System Recalibration Required
          </h3>
          <p className="mt-4 text-sm uppercase tracking-widest text-black/60 max-w-md mx-auto">
            Adjust your identity parameters to view new architectural matches.
          </p>
        </div>
      )}

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedRec && (
          <RecommendationDetail
            productName={selectedRec.product.name}
            productId={selectedRec.product.id}
            confidence={selectedRec.confidence}
            opinion={selectedRec.opinion}
            onClose={() => setSelectedRec(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
