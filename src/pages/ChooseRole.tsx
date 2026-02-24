import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ShoppingBag, Store, Loader2 } from "lucide-react";
import { syncUserRoleAndSession } from "@/lib/auth-sync";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function ChooseRole() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleRoleSelection(role: "buyer" | "seller") {
    if (!user) {
      toast({ title: "Not logged in", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // 1. Update the database
      const { error } = await supabase
        .from("user_profiles")
        .update({
          roles: [role],
          active_role: role,
        })
        .eq("id", user.id);

      if (error) throw error;

      // 2. Sync session and profile state
      const result = await syncUserRoleAndSession();

      // 3. Update global auth context so other components (like Navbar) update
      await refreshUser();

      if (result) {
        navigate(result.destination, { replace: true });
      } else {
        navigate(role === "seller" ? "/become-seller" : "/buyer", { replace: true });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function chooseBuyer() {
    await handleRoleSelection("buyer");
  }

  async function chooseSeller() {
    await handleRoleSelection("seller");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-muted/40 to-background">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md text-center space-y-8"
      >
        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            How do you want to continue?
          </h1>
          <p className="text-sm text-muted-foreground">
            You can switch roles later anytime
          </p>
        </div>

        {/* Role Card */}
        <div className="grid grid-cols-1 gap-4">
          {/* Buyer */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={chooseBuyer}
            disabled={loading}
            className="group w-full rounded-2xl border bg-card p-5 text-left shadow-sm hover:shadow-md transition-all disabled:opacity-50"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl p-3 bg-primary/10 text-primary">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ShoppingBag className="h-6 w-6" />}
              </div>
              <div className="flex-1">
                <h2 className="font-medium text-lg">
                  Continue as Buyer
                </h2>
                <p className="text-sm text-muted-foreground">
                  Discover outfits tailored to your style
                </p>
              </div>
            </div>
          </motion.button>

          {/* Seller */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={chooseSeller}
            disabled={loading}
            className="group w-full rounded-2xl border bg-card p-5 text-left shadow-sm hover:shadow-md transition-all disabled:opacity-50"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl p-3 bg-purple-500/10 text-purple-600">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Store className="h-6 w-6" />}
              </div>
              <div className="flex-1">
                <h2 className="font-medium text-lg">
                  Become a Seller
                </h2>
                <p className="text-sm text-muted-foreground">
                  List products and reach nearby buyers
                </p>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Small reassurance */}
        <p className="text-xs text-muted-foreground">
          Don’t worry — this choice isn’t permanent.
        </p>
      </motion.div>
    </div>
  );
}
