import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Package, BarChart3, HelpCircle } from "lucide-react";
import AppNavbar from "@/components/AppNavbar";
import type { LucideIcon } from "lucide-react";
type NavItemProps = {
  to: string;
  label: string;
  icon: LucideIcon;
};

export default function SellerLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    async function checkSeller() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/auth", { replace: true });

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("active_role")
        .eq("id", user.id)
        .single();

      if (profile?.active_role !== "seller") {
        navigate("/", { replace: true });
        return;
      }

      const { data: seller } = await supabase
        .from("seller_profile")
        .select("store_name")
        .eq("id", user.id)
        .single();

      if (!seller) return navigate("/", { replace: true });

      setStoreName(seller.store_name);
      setLoading(false);
    }

    checkSeller();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AppNavbar />

      <div className="flex min-h-screen bg-background">
        {/* SIDEBAR */}
        <aside className="hidden md:flex w-64 border-r bg-muted/40 p-6 flex-col">
          <h2 className="font-semibold text-lg mb-8 truncate">
            {storeName}
          </h2>

          <nav className="space-y-2 text-sm">
            <NavItem to="/seller/dashboard" icon={BarChart3} label="Dashboard" />
            <NavItem to="/seller/products" icon={Package} label="Products" />
            <NavItem to="/seller/help" icon={HelpCircle} label="Help" />
          </nav>
        </aside>

        {/* PAGE CONTENT */}
<main className="flex-1 p-6 sm:p-8">
  <div className="max-w-7xl mx-auto w-full">
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
