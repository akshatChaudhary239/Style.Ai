import { supabase } from "@/integrations/supabase/client";

export interface BecomeSellerInput {
  
  store_name: string;
  business_type: string;
  location: string;
}

export async function becomeSeller(input: BecomeSellerInput): Promise<void> {
  const { error } = await supabase.rpc("become_seller", {
    p_store_name: input.store_name,
    p_business_type: input.business_type,
    p_location: input.location,
  });

  if (error) {
    throw new Error(error.message);
  }
}
