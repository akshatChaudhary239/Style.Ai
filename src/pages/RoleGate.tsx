import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function RoleGate() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    // ❌ No auth → go login
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }

    async function decide() {
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("active_role")
        .eq("id", user.id)
        .single();

      // 🔥 Profile missing or token corrupted → HARD RESET
      if (error || !profile) {
        await supabase.auth.signOut();
        navigate("/auth", { replace: true });
        return;
      }

      if (!profile.active_role) {
        navigate("/choose-role", { replace: true });
        return;
      }

      if (profile.active_role === "buyer") {
        navigate("/buyer", { replace: true });
      } else {
        navigate("/seller/dashboard", { replace: true });
      }
    }

    decide();
  }, [user, loading, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
