import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import {
  LogOut,
  RefreshCcw,
  ShoppingBag,
  Store,
  Sparkles,
  Heart,
  LayoutDashboard,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Role = "buyer" | "seller";

export default function AppNavbar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch role when user is ready
  useEffect(() => {
    if (!user) {
      setActiveRole(null);
      return;
    }

    fetchActiveRole();
  }, [user]);

  async function fetchActiveRole() {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_profiles")
      .select("active_role")
      .eq("id", user.id)
      .single();

    if (!error && (data?.active_role === "buyer" || data?.active_role === "seller")) {
      setActiveRole(data.active_role);
    }
  }

  async function switchRole() {
    if (!user || !activeRole) return;

    setLoading(true);
    const newRole: Role = activeRole === "seller" ? "buyer" : "seller";

    const { error } = await supabase
      .from("user_profiles")
      .update({ active_role: newRole })
      .eq("id", user.id);

    if (!error) {
      setActiveRole(newRole);

      // 🔥 Navigate AFTER DB update
      navigate(newRole === "seller" ? "/seller/dashboard" : "/buyer", {
        replace: true,
      });
    }

    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  }

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur"
    >
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between">
        
        {/* LEFT — BRAND */}
        <button
          onClick={() =>
            navigate(activeRole === "seller" ? "/seller/dashboard" : "/buyer")
          }
          className="flex items-center gap-2 font-semibold text-lg tracking-tight"
        >
          <Sparkles className="h-5 w-5 text-primary" />
          <span>Style.AI</span>
        </button>

        {/* CENTER — NAV */}
        <div className="hidden md:flex items-center gap-1 rounded-full bg-muted p-1">
          {activeRole === "seller" && (
            <>
              <NavPill
                label="Dashboard"
                icon={LayoutDashboard}
                onClick={() => navigate("/seller/dashboard")}
              />
              <NavPill
                label="Products"
                icon={Store}
                onClick={() => navigate("/seller/products")}
              />
            </>
          )}

          {activeRole === "buyer" && (
            <>
              <NavPill
                label="Discover"
                icon={ShoppingBag}
                onClick={() => navigate("/buyer")}
              />
              <NavPill
                label="Favorites"
                icon={Heart}
                onClick={() => navigate("/buyer/favorites")}
              />
            </>
          )}
        </div>

        {/* RIGHT — ACTIONS */}
        <div className="flex items-center gap-2">
          {activeRole && (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={switchRole}
              disabled={loading}
              className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-muted transition"
            >
              <RefreshCcw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">
                Switch to {activeRole === "seller" ? "Buyer" : "Seller"}
              </span>
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={logout}
            className="rounded-full p-2 hover:bg-muted transition"
            title="Logout"
          >
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}

/* ---------- Nav Pill ---------- */
function NavPill({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background transition"
    >
      <Icon className="h-4 w-4" />
      {label}
    </motion.button>
  );
}
