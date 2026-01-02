import { Product, RecommendationInsight } from "./types";
import { StyleContextState } from "@/context/StyleContext";

export function generateOpinion(
  product: Product,
  context: StyleContextState
): RecommendationInsight {
  const positives: string[] = [];
  const concerns: string[] = [];

  if (context.occasion === product.occasion) {
    positives.push(`Great choice for a ${context.occasion} look`);
  }

  if (context.styleOverride === product.style) {
    positives.push(`Aligns well with your preferred style`);
  }

  if (product.priceRange === "high") {
    concerns.push("This option is slightly on the expensive side");
  }

  let finalOpinion =
    "This is a balanced option worth considering.";

  if (positives.length >= 2 && concerns.length === 0) {
    finalOpinion =
      "I really like this for you — it fits your intent very well.";
  }

  if (positives.length && concerns.length) {
    finalOpinion =
      "This works well overall, but there are some tradeoffs.";
  }

  if (!positives.length && concerns.length) {
    finalOpinion =
      "I wouldn’t prioritize this for today, but it may work later.";
  }

  return { positives, concerns, finalOpinion };
}
