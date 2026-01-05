import { Product } from "./types";
import { StyleContextState } from "@/context/StyleContext";
import { scoreProduct } from "./scoringEngine";
import { generateOpinion } from "./opinionEngine";

export function recommendProducts(
  products: Product[],
  context: StyleContextState
) 

{
    
  return products
    .map((product) => {
      const scoring = scoreProduct(product, context);
      if (scoring.score === -Infinity) return null;

return {
  product,
  score: scoring.score,
  reasons: scoring.reasons,
  confidence: scoring.confidence,
  opinion: generateOpinion(product, scoring), // STRING
};
    })
    .filter(Boolean)
    .sort((a, b) => b!.score - a!.score);
}

