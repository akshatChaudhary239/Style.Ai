import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus } from "lucide-react";
import { motion } from "framer-motion";

import ProductList from "./ProductList";
import ProductEditor from "./ProductEditor";
import { Database } from "@/integrations/supabase/types";

type Product =
  Database["public"]["Tables"]["products"]["Row"];

type Panel = "none" | "list" | "create" | "edit";

export default function SellerProducts() {
  const [loading, setLoading] = useState(true);
  const [panel, setPanel] = useState<Panel>("list");
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [totalSlots, setTotalSlots] = useState(0);
  const [usedSlots, setUsedSlots] = useState(0);

  const availableSlots = totalSlots - usedSlots;

  useEffect(() => {
    fetchSellerSlots();
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
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Products
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your listings and slot usage
          </p>
        </div>

        <button
          onClick={() => setPanel("create")}
          disabled={availableSlots <= 0}
          className="
            inline-flex items-center gap-2
            rounded-xl bg-primary px-4 py-2
            text-primary-foreground
            hover:opacity-90 transition
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <Plus className="h-4 w-4" />
          Upload Product
        </button>
      </div>

      {/* SLOT INFORMATION */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Total Slots" value={totalSlots} />
        <StatCard label="Used Slots" value={usedSlots} />
        <StatCard
          label="Available Slots"
          value={availableSlots}
          highlight={availableSlots === 0 ? "danger" : "success"}
        />
      </div>

      {/* PRODUCT LIST */}
      {panel === "list" && (
        <ProductList
          onCreate={() => setPanel("create")}
          onEdit={(product) => {
            setSelectedProduct(product);
            setPanel("edit");
          }}
          onStatusChange={fetchSellerSlots}
          onClose={() => {}}
        />
      )}

      {/* OVERLAY — CREATE / EDIT */}
      {panel !== "list" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/40 flex justify-center items-start pt-10"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="
              bg-background
              w-[95%] max-w-5xl
              rounded-2xl
              shadow-xl
              p-6
              relative
            "
          >
            <button
              onClick={() => {
                setPanel("list");
                setSelectedProduct(null);
              }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
            >
              ✕
            </button>

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
        </motion.div>
      )}
    </div>
  );
}

/* ---------- SMALL UI COMPONENT ---------- */

type StatCardProps = {
  label: string;
  value: number;
  highlight?: "success" | "danger";
};

function StatCard({ label, value, highlight }: StatCardProps) {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="rounded-2xl border bg-card p-5"
    >
      <p className="text-sm text-muted-foreground">
        {label}
      </p>
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
