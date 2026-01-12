import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useStyleContext } from "@/context/StyleContext";
import ContextBadge from "./ContextBadge";
import StylistChat from "@/components/StylistChat";

import { recommendProducts } from "@/recommendation/recommendProducts";
import RecommendationDetail from "./RecommendationDetail";

type RecommendationItem = ReturnType<typeof recommendProducts>[number];

export default function Recommendations() {
  const { draftContext, appliedContext, applyContext } = useStyleContext();
  const [selectedRec, setSelectedRec] =
    useState<RecommendationItem | null>(null);

  const recommendations = recommendProducts([], appliedContext);

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl"
      >
        <h1 className="text-4xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Style.AI
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          I analyze your intent, preferences, and context to find what truly fits you.
        </p>
      </motion.div>

      {/* INTENT SETTER */}
      <StylistChat />

      {/* CONTEXT BADGE */}
      <ContextBadge
        draftContext={draftContext}
        appliedContext={appliedContext}
        onApply={applyContext}
        onEdit={() => {}}
      />

      {/* RESULTS */}
      <section className="space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Your best matches today
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.product.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRec(rec)}
              className="
                relative
                cursor-pointer
                rounded-3xl
                border
                bg-white/80
                backdrop-blur
                p-5 sm:p-6
                shadow-lg
                hover:shadow-xl
                transition
              "
            >
              {/* Glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-200/40 to-sky-200/40 blur-xl -z-10" />

              {/* Confidence Pill */}
              <div
                className={`
                  absolute top-4 right-4
                  text-xs font-medium
                  px-3 py-1 rounded-full
                  ${
                    rec.confidence === "high"
                      ? "bg-green-100 text-green-700"
                      : rec.confidence === "medium"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }
                `}
              >
                {rec.confidence.toUpperCase()} CONFIDENCE
              </div>

              {/* Product */}
              <h3 className="font-semibold text-lg text-gray-900">
                {rec.product.name}
              </h3>

              {/* Reasons */}
              <div className="mt-3 space-y-1">
                {rec.reasons.slice(0, 3).map((reason, i) => (
                  <p
                    key={i}
                    className="text-sm text-gray-700 flex gap-2"
                  >
                    <span className="text-green-600">✔</span>
                    {reason}
                  </p>
                ))}
              </div>

              {/* Opinion */}
              <p className="mt-4 text-sm text-gray-600 italic leading-relaxed">
                “{rec.opinion}”
              </p>

              {/* CTA */}
              <p className="mt-5 text-sm font-medium text-blue-700 underline underline-offset-4">
                View full reasoning →
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EMPTY STATE */}
      {recommendations.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 text-gray-600"
        >
          <p className="text-lg font-semibold">
            Nothing fits perfectly yet
          </p>
          <p className="mt-2 text-sm max-w-md mx-auto">
            Try adjusting your occasion or preferences — I’ll rethink everything.
          </p>
        </motion.div>
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
