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
  <div className="space-y-10">
    
    {/* HERO */}
    <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white shadow-md">
      <h1 className="text-3xl font-semibold">
        Seller Dashboard
      </h1>
      <p className="mt-2 text-slate-300 max-w-xl">
        Manage your store, track slots, and grow with Style.AI.
      </p>
    </div>
<h1 className="text-3xl font-semibold">
  Welcome back 👋
</h1>
<p className="mt-2 text-slate-300">
  You’ve used <span className="text-white font-medium">{usedSlots}</span> out of{" "}
  <span className="text-white font-medium">{totalSlots}</span> slots
</p>
    {/* STATS */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <StatCard label="Total Slots" value={totalSlots} />
      <StatCard label="Used Slots" value={usedSlots} />
      <StatCard
        label="Available Slots"
        value={availableSlots}
        highlight={availableSlots === 0 ? "danger" : "success"}
      />
    </div>

    {/* FUTURE / CTA */}
    <div className="rounded-2xl border bg-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h3 className="font-medium text-gray-900">
          Ready to add more products?
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Buy more slots to increase your store visibility.
        </p>
      </div>

      <button className="rounded-xl bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 transition">
        Buy Slots (coming soon)
      </button>
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
