import { useState } from "react";
import { useStyleContext } from "@/context/StyleContext";
import ContextBadge from "./ContextBadge";
import StylistChat from "@/components/StylistChat";

import { recommendProducts } from "@/lib/recommendation/recommend";
import { Product } from "@/lib/recommendation/types";

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Elegant Kurta Set",
    occasion: "wedding",
    style: "traditional",
    priceRange: "high",
  },
  {
    id: 2,
    name: "Casual Oversized Tee",
    occasion: "casual",
    style: "streetwear",
    priceRange: "low",
  },
  {
    id: 3,
    name: "Formal Office Shirt",
    occasion: "office",
    style: "classic",
    priceRange: "medium",
  },
  {
    id: 4,
    name: "Minimal Party Shirt",
    occasion: "party",
    style: "classic",
    priceRange: "medium",
  },
];

export default function Recommendations() {
  const {
    draftContext,
    appliedContext,
    applyContext,
  } = useStyleContext();

  const recommendations = recommendProducts(
    MOCK_PRODUCTS,
    appliedContext
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Your personal stylist
        </h1>
        <p className="text-gray-500 mt-1">
          Tell me what you’re planning to wear today.
        </p>
      </div>

      {/* Stylist Chat (intent setter) */}
      <StylistChat />

      {/* Context Control */}
      <ContextBadge
        draftContext={draftContext}
        appliedContext={appliedContext}
        onApply={applyContext}
        onEdit={() => {
          // StylistChat already edits draft
        }}
      />

      {/* Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec) => (
          <div
            key={rec.product.id}
            className="bg-white border rounded-xl p-5 hover:shadow-md transition cursor-pointer"
          >
            <h3 className="font-semibold text-lg">
              {rec.product.name}
            </h3>

            <div className="mt-2 space-y-1">
              {rec.reasons.map((reason, i) => (
                <p
                  key={i}
                  className="text-sm text-green-600"
                >
                  ✔ {reason}
                </p>
              ))}
            </div>

            <p className="mt-3 text-sm text-gray-600 italic">
              “{rec.insight.finalOpinion}”
            </p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {recommendations.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          I don’t think anything fits today’s intent.
          Want to tweak your preferences?
        </div>
      )}
    </div>
  );
}
