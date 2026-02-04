import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Loader2, Package, BarChart3, HelpCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import AppNavbar from "@/components/AppNavbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type NavItemProps = {
  to: string;
  label: string;
  icon: LucideIcon;
};

export default function SellerLayout() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    if (authLoading) return;

    // ❌ Not logged in
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }

    let cancelled = false;

    async function checkSeller() {
      // 🔎 Check role from profile
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("active_role")
        .eq("id", user.id)
        .single();

      // 🔥 Corrupted auth/profile → HARD RESET
      if (profileError || !profile) {
        await supabase.auth.signOut();
        navigate("/auth", { replace: true });
        return;
      }

      // ❌ Not a seller
      if (profile.active_role !== "seller") {
        navigate("/", { replace: true });
        return;
      }

      // 🔎 Fetch seller profile
      const { data: seller, error: sellerError } = await supabase
        .from("seller_profile")
        .select("store_name")
        .eq("id", user.id)
        .single();

      if (sellerError || !seller) {
        navigate("/", { replace: true });
        return;
      }

      if (cancelled) return;

      setStoreName(seller.store_name);
      setLoading(false);
    }

    checkSeller();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading, navigate]);

  // 🔄 Unified loader (auth + role)
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AppNavbar />

      <div className="min-h-[calc(100vh-56px)] bg-slate-50 flex">
        {/* SIDEBAR */}
        <aside className="w-[280px] shrink-0 bg-white border-r px-6 py-8 flex flex-col">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Seller Panel
            </p>
            <h2 className="text-xl font-semibold text-gray-900 truncate">
              {storeName}
            </h2>
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            <NavItem to="/seller/dashboard" icon={BarChart3} label="Dashboard" />
            <NavItem to="/seller/products" icon={Package} label="Products" />
            <NavItem to="/seller/help" icon={HelpCircle} label="Help & Support" />
          </nav>

          <div className="border-t pt-5 text-sm text-gray-500">
            <p>Powered by Style.AI</p>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 px-8 py-8">
          <div className="max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}

function NavItem({ to, icon: Icon, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2 transition
        ${
          isActive
            ? "bg-background shadow-sm font-medium"
            : "text-muted-foreground hover:bg-background"
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );
}
