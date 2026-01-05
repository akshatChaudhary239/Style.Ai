import { Product } from "./types";

type Confidence = "high" | "medium" | "low";

export function generateOpinion(
  product: Product,
  scoring: {
    confidence: Confidence;
    reasons: string[];
  }
): string {
  const { confidence } = scoring;

  if (confidence === "high") {
    return "This is a strong match for you today — it aligns well with your preferences and intent.";
  }

  if (confidence === "medium") {
    return "This is a decent option and should work fine, though there may be better alternatives.";
  }

  return "This may not be the best pick for today, but it could make sense in a different context.";
}
