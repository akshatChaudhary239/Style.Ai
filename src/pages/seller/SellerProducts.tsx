import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

import ProductList from "./ProductList";
import ProductEditor from "./ProductEditor";
import { Database } from "@/integrations/supabase/types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Panel = "none" | "list" | "create" | "edit";

export default function SellerProducts() {
  const [loading, setLoading] = useState(true);
  const [panel, setPanel] = useState<Panel>("list");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [totalSlots, setTotalSlots] = useState(0);
  const [usedSlots, setUsedSlots] = useState(0);
  const availableSlots = totalSlots - usedSlots;

  const containerRef = useRef(null);

  useEffect(() => {
    fetchSellerSlots();

    const ctx = gsap.context(() => {
      gsap.from(".reveal-item", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

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

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-2 border-black border-t-transparent animate-spin mb-4" />
        <p className="text-[10px] font-black tracking-[0.4em] uppercase">Syncing Inventory</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-24">
      {/* HEADER */}
      <section className="reveal-item flex flex-col md:flex-row md:items-end md:justify-between gap-10">
        <div className="space-y-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-display">Inventory / Management</p>
          <h1 className="text-7xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.8] text-black">
            Product <br />
            <span className="text-black/10">Archive</span>
          </h1>
          <p className="text-xl text-black/60 font-light leading-relaxed max-w-2xl">
            Curate and deploy your architectural assets to the Style.AI ecosystem.
          </p>
        </div>

        <button
          onClick={() => setPanel("create")}
          disabled={availableSlots <= 0}
          className="group flex items-center gap-4 bg-black text-white px-12 py-5 text-[10px] font-black tracking-[0.4em] uppercase hover:bg-black/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          Deploy Asset
        </button>
      </section>

      {/* SLOT INFORMATION */}
      <section className="reveal-item grid grid-cols-1 md:grid-cols-3 gap-10">
        <StatCard label="Total Allocation" value={totalSlots} index={0} />
        <StatCard label="Active Deposits" value={usedSlots} index={1} />
        <StatCard
          label="Available Liquidity"
          value={availableSlots}
          index={2}
          highlight={availableSlots === 0 ? "danger" : "success"}
        />
      </section>

      {/* PRODUCT LIST */}
      {panel === "list" && (
        <div className="reveal-item">
          <ProductList
            onCreate={() => setPanel("create")}
            onEdit={(product) => {
              setSelectedProduct(product);
              setPanel("edit");
            }}
            onStatusChange={fetchSellerSlots}
            onClose={() => { }}
          />
        </div>
      )}

      {/* OVERLAY — CREATE / EDIT */}
      <AnimatePresence>
        {panel !== "list" && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setPanel("list");
                setSelectedProduct(null);
              }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto relative p-12 lg:p-20 shadow-2xl"
            >
              {/* Decorative bar */}
              <div className="absolute top-0 left-0 w-2 h-full bg-black"></div>

              <button
                onClick={() => {
                  setPanel("list");
                  setSelectedProduct(null);
                }}
                className="absolute top-8 right-8 text-black/20 hover:text-black transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>

              <div className="mb-12 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-display font-bold">Asset Protocol</p>
                <h2 className="text-4xl font-display font-black tracking-tighter uppercase leading-none">
                  {panel === "create" ? "Initialize New Asset" : "Modify Existing Asset"}
                </h2>
              </div>

              {panel === "create" && (
                <ProductEditor
                  mode="create"
                  onClose={() => setPanel("list")}
                  onCreated={fetchSellerSlots}
                />
              )}

              {panel === "edit" && selectedProduct && (
                <ProductEditor
                  mode="edit"
                  product={selectedProduct}
                  onClose={() => setPanel("list")}
                  onCreated={fetchSellerSlots}
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, highlight, index }: { label: string; value: number; highlight?: "success" | "danger"; index: number }) {
  return (
    <div className="bg-white border border-black/5 p-10 space-y-6 relative overflow-hidden group hover:border-black/20 transition-all duration-500">
      <span className="absolute -top-6 -right-2 text-8xl font-display font-black text-black/[0.02] group-hover:text-black/[0.05] transition-colors duration-500">
        0{index + 1}
      </span>
      <p className="text-[10px] font-black tracking-[0.3em] uppercase text-black/40 relative z-10">{label}</p>
      <div className="relative z-10 flex items-baseline gap-2">
        <p className={`text-5xl font-display font-black tracking-tighter leading-none ${highlight === "danger" ? "text-red-600" : "text-black"
          }`}>
          {value < 10 && value >= 0 ? `0${value}` : value}
        </p>
        <div className={`h-1.5 w-1.5 rounded-full ${highlight === 'danger' ? 'bg-red-600' : 'bg-black'}`}></div>
      </div>
    </div>
  );
}
