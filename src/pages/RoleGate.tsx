import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function RoleGate() {
  const navigate = useNavigate();

  useEffect(() => {
    async function decide() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth", { replace: true });
        return;
      }

      const { data, error } = await supabase
        .from("user_profiles")
        .select("active_role")
        .eq("id", user.id)
        .single();

      if (error || !data?.active_role) {
        navigate("/choose-role", { replace: true });
        return;
      }

      if (data.active_role === "buyer") {
        navigate("/profile", { replace: true });
      } else {
        navigate("/seller/dashboard", { replace: true });
      }
    }

    decide();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
