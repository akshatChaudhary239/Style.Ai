// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Product } from "../../recommendation/types";
import { scoreProduct } from "../../recommendation/scoringEngine";
import { generateOpinion } from "../../recommendation/opinionEngine";
import { StyleContextState } from "@/context/StyleContext";
import {
  TOP_PICK_PHRASES,
  STRONG_ALTERNATIVE_PHRASES,
  SAFE_OPTION_PHRASES,
  LOW_CONFIDENCE_PHRASES,
  pickPhrase,
} from "./phraseBank";


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
  // Phase 1: score + opinion
  const ranked = products
    .map((product) => {
      const scoring = scoreProduct(product, context);

      // Hard rejection
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

  // Phase 2: relative ranking language
  return ranked.map((item, index) => {
    let rankComment: string | null = null;

    if (item.confidence === "low") {
      rankComment = pickPhrase(
        LOW_CONFIDENCE_PHRASES,
        item.product.id
      );
    } else if (index === 0) {
      rankComment = pickPhrase(
        TOP_PICK_PHRASES,
        item.product.id
      );
    } else if (index === 1) {
      rankComment = pickPhrase(
        STRONG_ALTERNATIVE_PHRASES,
        item.product.id
      );
    } else if (index === 2) {
      rankComment = pickPhrase(
        SAFE_OPTION_PHRASES,
        item.product.id
      );
    }

    return {
      ...item,
      rankComment,
    };
  });
}
