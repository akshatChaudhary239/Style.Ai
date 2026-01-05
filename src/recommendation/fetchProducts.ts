import { supabase } from "@/integrations/supabase/client";
import { adaptDbProduct } from "./adapters/productAdapter";
import { Product } from "./types";

export async function fetchActiveProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active");

  if (error || !data) {
    console.error("Error fetching products", error);
    return [];
  }

  return data.map(adaptDbProduct);
}
