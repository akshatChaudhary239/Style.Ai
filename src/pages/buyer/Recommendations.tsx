import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useStyleContext } from "@/context/StyleContext";
import ContextBadge from "./ContextBadge";
import StylistChat from "@/components/StylistChat";

import { recommendProducts } from "@/recommendation/recommendProducts";
import { Product } from "../../recommendation/types";
import RecommendationDetail from "./RecommendationDetail";

type RecommendationItem = ReturnType<typeof recommendProducts>[number];

export default function Recommendations() {
  const { draftContext, appliedContext, applyContext } = useStyleContext();
  const [selectedRec, setSelectedRec] =
    useState<RecommendationItem | null>(null);

  const recommendations = recommendProducts([], appliedContext);

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Style.AI
        </h1>
        <p className="text-gray-500 mt-2 max-w-xl">
          I analyze your intent, preferences, and context to recommend what truly fits.
        </p>
      </motion.div>

      {/* Intent Setter */}
      <StylistChat />

      {/* Context Control */}
      <ContextBadge
        draftContext={draftContext}
        appliedContext={appliedContext}
        onApply={applyContext}
        onEdit={() => {}}
      />

      {/* Recommendation Results */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          Your best matches today
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedRec(rec)}
              className="relative bg-white border rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-md transition"
            >
              {/* Confidence Indicator */}
              <div className="absolute top-4 right-4 text-xs font-medium px-2 py-1 rounded-full bg-gray-900 text-white">
                {rec.confidence.toUpperCase()} CONFIDENCE
              </div>

              {/* Product Name */}
              <h3 className="font-semibold text-lg text-gray-900">
                {rec.product.name}
              </h3>

              {/* Reasons */}
              <div className="mt-3 space-y-1">
                {rec.reasons.slice(0, 3).map((reason, i) => (
                  <p
                    key={i}
                    className="text-sm text-green-700"
                  >
                    ✔ {reason}
                  </p>
                ))}
              </div>

              {/* Opinion */}
              <p className="mt-4 text-sm text-gray-600 italic">
                “{rec.opinion}”
              </p>

              {/* CTA */}
              <p className="mt-4 text-sm font-medium text-gray-900 underline underline-offset-4">
                View reasoning →
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Empty State */}
      {recommendations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-gray-500"
        >
          <p className="text-lg font-medium">
            Nothing fits perfectly yet.
          </p>
          <p className="mt-2 text-sm">
            Try adjusting the occasion or style — I’ll rethink it.
          </p>
        </motion.div>
      )}

      {/* Detail Modal */}
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
