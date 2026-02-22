import { useEffect, useState, useRef } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AppNavbar from "@/components/AppNavbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import gsap from "gsap";

export default function SellerLayout() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("");

  const sidebarRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }

    let cancelled = false;

    async function checkSeller() {
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("active_role")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        navigate("/auth", { replace: true });
        return;
      }

      if (profile.active_role !== "seller") {
        navigate("/", { replace: true });
        return;
      }

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

      // Animation Trigger
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(sidebarRef.current, { x: -50, opacity: 0, duration: 1 })
        .from(contentRef.current, { y: 20, opacity: 0, duration: 0.8 }, "-=0.6");
    }

    checkSeller();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <div className="w-12 h-12 border-2 border-black border-t-transparent animate-spin mb-4" />
        <p className="text-[10px] font-black tracking-[0.4em] uppercase">Initializing Identity</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-body selection:bg-black selection:text-white">
      <AppNavbar />

      <div className="flex pt-16 lg:pt-20">
        {/* SIDEBAR */}
        <aside
          ref={sidebarRef}
          className="hidden lg:flex w-[320px] h-[calc(100vh-80px)] bg-black text-white p-12 flex-col sticky top-20 border-r border-white/10"
        >
          <div className="mb-16">
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-4 font-display">Store Identity</p>
            <h2 className="text-3xl font-display font-black tracking-tighter leading-none uppercase">
              {storeName || "Vendor"}
            </h2>
          </div>

          <nav className="flex flex-col gap-8 flex-1">
            <NavItem to="/seller/dashboard" label="Overview" />
            <NavItem to="/seller/products" label="Inventory" />
            <NavItem to="/seller/help" label="Assistance" />
          </nav>

          <div className="mt-auto pt-10 border-t border-white/10 opacity-30">
            <p className="text-[10px] uppercase tracking-widest leading-relaxed">
              Professional Suite <br /> curated by Style.AI
            </p>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main
          ref={contentRef}
          className="flex-1 w-full px-8 md:px-16 lg:px-24 py-12 sm:py-20 min-h-screen bg-[#fafafa]"
        >
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center justify-between py-2 text-sm tracking-[0.3em] uppercase transition-all duration-300
        ${isActive
          ? "text-white font-bold translate-x-3"
          : "text-white/30 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span>{label}</span>
          <span className={`w-1 h-1 rounded-full bg-white transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></span>
        </>
      )}
    </NavLink>
  );
}
