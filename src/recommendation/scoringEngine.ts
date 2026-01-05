import { Product } from "./types";
import { StyleContextState } from "@/context/StyleContext";

type Confidence = "high" | "medium" | "low";

export function scoreProduct(
  product: Product,
  context: StyleContextState
) {
  let score = 0;
  const reasons: string[] = [];

  // Minimal safe scoring (V1)
  if (context.occasion) {
    score += 40;
    reasons.push(`Considered for ${context.occasion}`);
  }

  if (context.styleOverride) {
    score += 30;
    reasons.push(`Aligned with your style preference`);
  }

  const confidence: Confidence =
    score >= 60 ? "high" : score >= 30 ? "medium" : "low";

  return {
    score,
    reasons,
    confidence,
  };
}
