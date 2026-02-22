import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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

  const fetchActiveRole = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("user_profiles")
      .select("active_role")
      .eq("id", user.id)
      .single();

    if (!error && (data?.active_role === "buyer" || data?.active_role === "seller")) {
      setActiveRole(data.active_role);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setActiveRole(null);
      return;
    }
    fetchActiveRole();
  }, [user, fetchActiveRole]);

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
    <header className="fixed top-0 left-0 w-full z-[60] bg-white border-b border-black/5 h-20 flex items-center">
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">

        {/* LEFT — BRAND */}
        <button
          onClick={() => navigate(activeRole === "seller" ? "/seller/dashboard" : "/buyer")}
          className="group flex items-center gap-3"
        >
          <div className="w-8 h-8 bg-black flex items-center justify-center">
            <span className="text-white text-[10px] font-black tracking-tighter">S.AI</span>
          </div>
          <span className="text-xl font-display font-black uppercase tracking-tighter">Style.AI</span>
        </button>

        {/* CENTER — NAV (Editorial Style) */}
        <div className="hidden lg:flex items-center gap-12">
          {activeRole === "seller" && (
            <>
              <EditorialNavLink label="DASHBOARD" onClick={() => navigate("/seller/dashboard")} />
              <EditorialNavLink label="INVENTORY" onClick={() => navigate("/seller/products")} />
            </>
          )}

          {activeRole === "buyer" && (
            <>
              <EditorialNavLink label="EXPLORE" onClick={() => navigate("/buyer")} />
              <EditorialNavLink label="ARCHIVE" onClick={() => navigate("/buyer/liked")} />
            </>
          )}
        </div>

        {/* RIGHT — ACTIONS */}
        <div className="flex items-center gap-6">
          {activeRole && (
            <button
              onClick={switchRole}
              disabled={loading}
              className="group flex items-center gap-3 py-2 px-4 border border-black hover:bg-black hover:text-white transition-all duration-300 transform active:scale-95"
            >
              <RefreshCcw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">
                {activeRole === "seller" ? "BUYER" : "SELLER"} PORTAL
              </span>
            </button>
          )}

          <button
            onClick={logout}
            className="group flex items-center gap-2 text-black/40 hover:text-black transition-colors"
            title="LOGOUT"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-[10px] font-black tracking-widest uppercase hidden md:inline">EXIT</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function EditorialNavLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative group text-[10px] font-black tracking-[0.3em] uppercase transition-colors"
    >
      {label}
      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
    </button>
  );
}
