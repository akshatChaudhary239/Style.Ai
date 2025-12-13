import { supabase } from "@/integrations/supabase/client";

export type BodyType = "skinny" | "fat" | "skinny fat" | "extreme fat";
export type SkinTone = "white" | "brown" | "black" | "asian";

export interface UserProfile {
  id: string; // SAME as auth.users.id
  height_cm: number;
  weight_kg: number;
  body_type: BodyType;
  skin_tone: SkinTone;
  created_at: string;
  updated_at: string;
}

export interface ProfileInput {
  height_cm: number;
  weight_kg: number;
  body_type: BodyType;
  skin_tone: SkinTone;
}

export async function getAuthenticatedUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function getProfileByUserId(
  userId: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
    return {
    ...data,
    body_type: data.body_type as BodyType,
    skin_tone: data.skin_tone as SkinTone,
  };
}

export async function saveOrUpdateProfile(
  userId: string,
  input: ProfileInput
): Promise<{ profile: UserProfile; isNew: boolean }> {

  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(
      {
        id: userId, // 🔥 THIS IS THE FIX
        ...input,
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (error) throw error;

  return {
    profile: {
      ...data,
      body_type: data.body_type as BodyType,
      skin_tone: data.skin_tone as SkinTone,
    },
    isNew: false,
  };
}
