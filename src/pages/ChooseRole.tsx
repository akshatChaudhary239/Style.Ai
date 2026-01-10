import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ShoppingBag, Store } from "lucide-react";

export default function ChooseRole() {
  const navigate = useNavigate();

  async function chooseBuyer() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast({ title: "Not logged in", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from("user_profiles")
      .update({
        roles: ["buyer"],
        active_role: "buyer",
      })
      .eq("id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    navigate("/profile");
  }

  async function chooseSeller() {
    navigate("/seller");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-gradient-to-br from-background via-muted/40 to-background">
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

        {/* Role Cards */}
        <div className="grid grid-cols-1 gap-4">
          {/* Buyer */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={chooseBuyer}
            className="group w-full rounded-2xl border bg-card p-5 text-left shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl p-3 bg-primary/10 text-primary">
                <ShoppingBag className="h-6 w-6" />
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
            className="group w-full rounded-2xl border bg-card p-5 text-left shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl p-3 bg-purple-500/10 text-purple-600">
                <Store className="h-6 w-6" />
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
