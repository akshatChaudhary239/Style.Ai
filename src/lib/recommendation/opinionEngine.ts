import { Product, RecommendationInsight } from "./types";
import { StyleContextState } from "@/context/StyleContext";

type Confidence = "high" | "medium" | "low";

export function generateOpinion(
  product: Product,
  context: StyleContextState,
  confidence: Confidence
): RecommendationInsight {
  const positives: string[] = [];
  const concerns: string[] = [];

  /* ---------- POSITIVES ---------- */

  if (context.occasion === product.occasion) {
    positives.push(`Well suited for a ${context.occasion} look`);
  }

  if (context.styleOverride && product.style) {
    if (context.styleOverride === product.style) {
      positives.push(
        `Aligns nicely with your ${product.style} style preference`
      );
    } else {
      concerns.push(
        `The style doesn’t fully match what you’re aiming for today`
      );
    }
  }

  /* ---------- PRICE AWARENESS ---------- */

  if (product.priceRange === "high") {
    concerns.push(
      "This piece is on the expensive side compared to similar options"
    );
  }

  if (product.priceRange === "low" && confidence === "high") {
    positives.push(
      "Good value for money without compromising much on style"
    );
  }

  /* ---------- FINAL OPINION (VOICE MATTERS) ---------- */

  let finalOpinion: string;

  if (confidence === "high") {
    finalOpinion =
      "I strongly recommend this for you today — it fits your intent and overall style really well.";
  } else if (confidence === "medium") {
    finalOpinion =
      "This is a solid option and should work well, though we can explore alternatives if you want to compare.";
  } else {
    finalOpinion =
      "I wouldn’t prioritise this for today, but it could make sense in a different situation or context.";
  }

  return {
    positives,
    concerns,
    finalOpinion,
  };
}
