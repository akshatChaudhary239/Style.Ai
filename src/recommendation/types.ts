export type Product = {
  id: string;
  name: string;
  category: string;
  colors: string[];
  sizes: string[];
  seller_id: string;

  // optional — context handles occasion, NOT product
  gender?: "male" | "female" | "unisex";
  price?: number;
};
