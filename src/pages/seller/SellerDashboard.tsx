import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

type StatCardProps = {
  label: string;
  value: number;
  highlight?: "success" | "danger";
};
export default function SellerDashboard() {
  const [totalSlots, setTotalSlots] = useState(0);
  const [usedSlots, setUsedSlots] = useState(0);

  useEffect(() => {
    async function loadSlots() {
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

    loadSlots();
  }, []);

  const availableSlots = totalSlots - usedSlots;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Seller Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your store activity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Total Slots" value={totalSlots} />
        <StatCard label="Used Slots" value={usedSlots} />
        <StatCard
          label="Available Slots"
          value={availableSlots}
          highlight={availableSlots === 0 ? "danger" : "success"}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }: StatCardProps) {
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
