import { useState } from "react";
import { useStyleContext } from "@/context/StyleContext";
import ContextBadge from "./ContextBadge";
import StylistChat from "@/components/StylistChat";

import { recommendProducts } from "@/recommendation/recommendProducts";

import { Product } from "../../recommendation/types";
import RecommendationDetail from "./RecommendationDetail";
type RecommendationItem = ReturnType<typeof recommendProducts>[number];


const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Elegant Kurta Set",
    category: "ethnic",
    colors: ["cream", "gold"],
    sizes: ["M", "L"],
    seller_id: "seller-1",
  },
  {
    id: "2",
    name: "Casual Oversized Tee",
    category: "casual",
    colors: ["black"],
    sizes: ["L", "XL"],
    seller_id: "seller-2",
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
    const [selectedRec, setSelectedRec] =
    useState<RecommendationItem | null>(null);

    

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
  onClick={() => setSelectedRec(rec)}
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
              “{rec.opinion}”
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
{selectedRec && (
<RecommendationDetail
  productName={selectedRec.product.name}
  productId={selectedRec.product.id}
  confidence={selectedRec.confidence}
  opinion={selectedRec.opinion}
  onClose={() => setSelectedRec(null)}
/>

)}

    </div>
  );
}
