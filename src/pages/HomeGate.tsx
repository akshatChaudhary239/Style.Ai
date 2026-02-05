import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function HomeGate() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const decidedRef = useRef(false);

  useEffect(() => {
    if (loading) return;
    if (decidedRef.current) return;

    decidedRef.current = true;

    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }

    (async () => {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("active_role")
        .eq("id", user.id)
        .single();

      if (!profile?.active_role) {
        navigate("/choose-role", { replace: true });
        return;
      }

      if (profile.active_role === "buyer") {
        navigate("/buyer", { replace: true });
      } else {
        navigate("/seller/dashboard", { replace: true });
      }
    })();
  }, [user, loading, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
