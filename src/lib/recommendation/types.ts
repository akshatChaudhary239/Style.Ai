export type PriceRange = "low" | "medium" | "high";

export type Product = {
  id: number;
  name: string;
  occasion: "wedding" | "party" | "office" | "casual";
  style?: "traditional" | "classic" | "streetwear";
  priceRange?: PriceRange;
};

export type RecommendationInsight = {
  positives: string[];
  concerns: string[];
  finalOpinion: string;
};
