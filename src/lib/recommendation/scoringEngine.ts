import { Product } from "./types";
import { StyleContextState } from "@/context/StyleContext";

export function scoreProduct(
  product: Product,
  context: StyleContextState
) {
  let score = 0;
  const reasons: string[] = [];

  if (context.occasion) {
    if (product.occasion !== context.occasion) {
      return { score: -Infinity, reasons: [] };
    }
    score += 50;
    reasons.push(`Perfect for ${context.occasion}`);
  }

  if (context.styleOverride && product.style === context.styleOverride) {
    score += 20;
    reasons.push(`Matches your ${context.styleOverride} style`);
  }

  return { score, reasons };
}
