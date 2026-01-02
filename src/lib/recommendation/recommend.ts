import { Product } from "./types";
import { scoreProduct } from "./scoringEngine";
import { generateOpinion } from "./opinionEngine";
import { StyleContextState } from "@/context/StyleContext";

export function recommendProducts(
  products: Product[],
  context: StyleContextState
) {
  return products
    .map((product) => {
      const scoring = scoreProduct(product, context);
      if (scoring.score === -Infinity) return null;

      return {
        product,
        score: scoring.score,
        reasons: scoring.reasons,
        insight: generateOpinion(product, context),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b!.score - a!.score);
}
