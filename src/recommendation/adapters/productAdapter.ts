import { Database } from "@/integrations/supabase/types";
import { Product } from "../types";

type DbProduct = Database["public"]["Tables"]["products"]["Row"];

export function adaptDbProduct(db: DbProduct): Product {
  return {
    id: db.id,
    name: db.name,
    category: db.category,
    colors: db.color ? [db.color] : [],
    sizes: db.size ? [db.size] : [],
    seller_id: db.seller_id,
  };
}
