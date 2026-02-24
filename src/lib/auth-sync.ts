import { supabase } from "@/integrations/supabase/client";

export type Role = "buyer" | "seller";

export interface SyncResult {
    activeRole: Role | null;
    hasSellerProfile: boolean;
    destination: string;
}

/**
 * Synchronizes the frontend session and profile state with the database.
 * Useful after role changes or onboarding.
 */
export async function syncUserRoleAndSession(): Promise<SyncResult | null> {
    // 1. Refresh the session to get latest JWT if needed
    const { data: { session }, error: sessionError } = await supabase.auth.refreshSession();

    const user = session?.user;
    if (!user || sessionError) return null;

    // 2. Fetch the latest profile data directly from the DB
    const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("active_role, roles")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) return null;

    const activeRole = profile.active_role as Role;

    // 3. Specifically check for seller profile if active role is seller
    let hasSellerProfile = false;
    if (activeRole === "seller") {
        const { data: seller, error: sellerError } = await supabase
            .from("seller_profile")
            .select("id")
            .eq("id", user.id)
            .maybeSingle();

        hasSellerProfile = !!seller;
    }

    // 4. Determine destination path
    let destination = "/";
    if (activeRole === "buyer") {
        destination = "/buyer";
    } else if (activeRole === "seller") {
        destination = hasSellerProfile ? "/seller/dashboard" : "/become-seller";
    } else {
        destination = "/choose-role";
    }

    return {
        activeRole,
        hasSellerProfile,
        destination
    };
}
