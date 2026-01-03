import { Product } from "./types";
import { scoreProduct } from "./scoringEngine";
import { generateOpinion } from "./opinionEngine";
import { StyleContextState } from "@/context/StyleContext";

type Confidence = "high" | "medium" | "low";

function getConfidence(score: number): Confidence {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

export function recommendProducts(
  products: Product[],
  context: StyleContextState
) {
  return products
    .map((product) => {
      const scoring = scoreProduct(product, context);

      // Hard rejection (context mismatch)
      if (scoring.score === -Infinity) return null;

      const confidence = getConfidence(scoring.score);

      return {
        product,
        score: scoring.score,
        confidence,
        reasons: scoring.reasons,
        insight: generateOpinion(
          product,
          context,
          confidence
        ),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b!.score - a!.score);
}
