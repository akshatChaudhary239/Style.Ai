import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import gsap from "gsap";

type StatCardProps = {
  label: string;
  value: number;
  highlight?: "success" | "danger";
  index: number;
};

export default function SellerDashboard() {
  const [totalSlots, setTotalSlots] = useState(0);
  const [usedSlots, setUsedSlots] = useState(0);
  const containerRef = useRef(null);

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

    const ctx = gsap.context(() => {
      gsap.from(".reveal-item", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const availableSlots = totalSlots - usedSlots;

  return (
    <div ref={containerRef} className="space-y-24">
      {/* HEADER */}
      <section className="reveal-item space-y-6">
        <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-display">Performance / Metrics</p>
        <h1 className="text-7xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.8] text-black">
          Business <br />
          <span className="text-black/10">Architecture</span>
        </h1>
        <p className="text-xl text-black/60 font-light leading-relaxed max-w-2xl">
          A high-level overview of your digital storefront. Monitor your resource allocation and system capacity in real-time.
        </p>
      </section>

      {/* SLOT STATUS */}
      <section className="reveal-item">
        <div className="bg-black text-white p-12 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4">
            <p className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40">System Capacity</p>
            <h3 className="text-4xl font-display font-black tracking-tighter uppercase leading-none">
              {availableSlots === 0
                ? "Resource Limits Reached"
                : `${availableSlots} Operational Slots Available`}
            </h3>
            <p className="text-sm text-white/60 font-light">
              {availableSlots === 0
                ? "Expand your architectural footprint to continue uploading assets."
                : "The system is optimized and ready for further product integration."}
            </p>
          </div>

          <button className="whitespace-nowrap bg-white text-black px-12 py-5 text-[10px] font-black tracking-[0.4em] uppercase hover:bg-gray-100 transition-all transform active:scale-95">
            Acquire Slots
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="space-y-12">
        <div className="reveal-item border-b border-black pb-4">
          <h2 className="text-2xl font-display font-bold uppercase tracking-tighter">
            Analytical Parameters
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <StatCard label="TOTAL SYSTEM SLOTS" value={totalSlots} index={0} />
          <StatCard label="UTILIZED RESOURCES" value={usedSlots} index={1} />
          <StatCard
            label="AVAILABLE CAPACITY"
            value={availableSlots}
            highlight={availableSlots === 0 ? "danger" : "success"}
            index={2}
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, highlight, index }: StatCardProps) {
  return (
    <div className="reveal-item bg-white border border-black/5 p-10 space-y-8 relative overflow-hidden group hover:border-black/20 transition-all duration-500">
      {/* Decorative Index */}
      <span className="absolute -top-6 -right-2 text-8xl font-display font-black text-black/[0.02] group-hover:text-black/[0.05] transition-colors duration-500">
        0{index + 1}
      </span>

      <p className="text-[10px] font-black tracking-[0.3em] uppercase text-black/40 relative z-10">{label}</p>

      <div className="relative z-10 space-y-2">
        <p className={`text-6xl font-display font-black tracking-tighter leading-none ${highlight === "success"
            ? "text-black"
            : highlight === "danger"
              ? "text-red-600"
              : "text-black"
          }`}>
          {value < 10 && value >= 0 ? `0${value}` : value}
        </p>
        <div className={`h-1 w-12 ${highlight === 'danger' ? 'bg-red-600' : 'bg-black'}`}></div>
      </div>
    </div>
  );
}
