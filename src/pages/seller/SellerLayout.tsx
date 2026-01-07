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

    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-slate-50 to-gray-100 flex">
      
      {/* SIDEBAR — 20% */}
      <aside className="hidden md:flex w-[20%] min-w-[240px] bg-white border-r px-5 py-6 flex-col">
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

        <div className="border-t pt-4 text-sm text-gray-500">
          <p>Powered by Style.AI</p>
        </div>
      </aside>

      {/* MAIN CONTENT — 80% */}
      <main className="w-full md:w-[80%] px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto">
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
