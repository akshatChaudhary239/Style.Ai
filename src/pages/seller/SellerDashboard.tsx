import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Outlet, useNavigate } from "react-router-dom";
import { Loader2, Plus, Package, BarChart3, HelpCircle, LucideIcon } from "lucide-react";
import ProductList from "./ProductList";
import ProductEditor from "./ProductEditor";
import { Database } from "@/integrations/supabase/types";
import AppNavbar from "@/components/AppNavbar";
import { motion } from "framer-motion";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Panel = "none" | "products" | "create" | "edit";

export default function SellerDashboard() {
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [totalSlots, setTotalSlots] = useState(0);
  const [usedSlots, setUsedSlots] = useState(0);
  const [activePanel, setActivePanel] = useState<Panel>("none");

  const availableSlots = totalSlots - usedSlots;

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
        .select("store_name, total_slots, used_slots")
        .eq("id", user.id)
        .single();

      if (!seller) return navigate("/", { replace: true });

      setStoreName(seller.store_name);
      setTotalSlots(seller.total_slots);
      setUsedSlots(seller.used_slots);
      setLoading(false);
    }

    checkSeller();
  }, [navigate]);

  async function fetchSellerSlots() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("seller_profile")
      .select("total_slots, used_slots")
      .eq("id", user.id)
      .single();

    if (data) {
      setTotalSlots(data.total_slots);
      setUsedSlots(data.used_slots);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <AppNavbar />
      <Outlet />

      <div
        className={`flex min-h-screen bg-background ${
          activePanel !== "none" ? "blur-sm pointer-events-none" : ""
        }`}
      >
        {/* SIDEBAR */}
        <aside className="hidden md:flex w-64 border-r bg-muted/40 p-6 flex-col">
          <h2 className="font-semibold text-lg mb-8 truncate">
            {storeName}
          </h2>

          <nav className="space-y-2 text-sm">
            <SidebarItem icon={BarChart3} label="Dashboard" active />
            <SidebarItem
              icon={Package}
              label="Products"
              onClick={() => setActivePanel("products")}
            />
            <SidebarItem icon={BarChart3} label="Growth" disabled />
            <SidebarItem icon={HelpCircle} label="Help" disabled />
          </nav>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-6 sm:p-8">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-semibold">
                Seller Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your listings and slot usage
              </p>
            </div>

            <button
              onClick={() => setActivePanel("create")}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 transition"
            >
              <Plus className="h-4 w-4" />
              Upload Product
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard label="Total Slots" value={totalSlots} />
            <StatCard label="Used Slots" value={usedSlots} />
            <StatCard
              label="Available Slots"
              value={availableSlots}
              highlight={
                availableSlots === 0 ? "danger" : "success"
              }
            />
          </div>
        </main>
      </div>

      {/* OVERLAY PANEL */}
      {activePanel !== "none" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/40 flex justify-center items-start pt-10"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="bg-background w-[95%] max-w-5xl rounded-2xl shadow-xl p-6 relative"
          >
            <button
              onClick={() => setActivePanel("none")}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
            >
              ✕
            </button>

            {activePanel === "products" && (
              <ProductList
                onCreate={() => setActivePanel("create")}
                onEdit={(product) => {
                  setSelectedProduct(product);
                  setActivePanel("edit");
                }}
                onStatusChange={fetchSellerSlots}
                onClose={() => setActivePanel("none")}
              />
            )}

            {activePanel === "create" && (
              <ProductEditor
                mode="create"
                onClose={() => setActivePanel("none")}
                onCreated={fetchSellerSlots}
              />
            )}

            {activePanel === "edit" && selectedProduct && (
              <ProductEditor
                mode="edit"
                product={selectedProduct}
                onClose={() => setActivePanel("none")}
                onCreated={fetchSellerSlots}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

/* ---------- SMALL UI COMPONENTS ---------- */

function SidebarItem({
  label,
  icon: Icon,
  active,
  disabled,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left transition
        ${
          active
            ? "bg-background font-medium shadow-sm"
            : "text-muted-foreground hover:bg-background"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: "success" | "danger";
}) {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="rounded-2xl border bg-card p-5"
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={`mt-1 text-3xl font-semibold ${
          highlight === "success"
            ? "text-green-600"
            : highlight === "danger"
            ? "text-red-500"
            : ""
        }`}
      >
        {value}
      </p>
    </motion.div>
  );
}
