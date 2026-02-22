import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const SELLER_FAQS = [
  {
    q: "How does selling on Style.AI work?",
    a: "You upload your products as drafts, review them, and publish them when ready. Only published products are visible to buyers and eligible for recommendations."
  },
  {
    q: "Why is my product not visible to buyers?",
    a: "Products in draft mode are not shown to buyers. Make sure your product is published and you have available slots."
  },
  {
    q: "What are product slots?",
    a: "Slots define how many active (published) products you can have at a time. Draft products do not consume slots. Unpublishing a product frees up a slot."
  },
  {
    q: "Do drafts consume slots?",
    a: "No. You can create unlimited draft products. Only published products count toward your slot limit."
  },
  {
    q: "What happens if I unpublish a product?",
    a: "The product is removed from buyer recommendations and your slot is freed. You can republish it later if slots are available."
  },
  {
    q: "Do buyers see my personal information?",
    a: "No. Buyers only see product details and store-related information. Your personal account data remains private."
  },
];

export default function SellerHelpSupport() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal-support", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  function handleSubmit() {
    if (!message.trim()) return;
    window.location.href = `mailto:seller-support@styleai.app?subject=Style.AI Seller Support&body=${encodeURIComponent(
      message
    )}`;
    setMessage("");
  }

  return (
    <div ref={containerRef} className="max-w-4xl space-y-24">
      {/* Header */}
      <section className="reveal-support space-y-6">
        <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-display font-bold">Internal Protocol / Assistance</p>
        <h1 className="text-7xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.8] text-black">
          Business <br />
          <span className="text-black/10">Assistance</span>
        </h1>
        <p className="text-xl text-black/60 font-light leading-relaxed max-w-2xl">
          Technical and operational documentation for the Style.AI seller ecosystem.
        </p>
      </section>

      {/* Overview */}
      <section className="reveal-support bg-black text-white p-12 space-y-4">
        <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40">
          Operational Logic
        </h2>
        <p className="text-lg font-light leading-relaxed opacity-80">
          Style.AI helps sellers reach the right buyers using intelligent recommendations.
          You control what products are live using a slot-based system, and only active
          products are shown to buyers. Drafts allow you to prepare listings without
          affecting visibility.
        </p>
      </section>

      {/* FAQs */}
      <section className="reveal-support space-y-12">
        <div className="border-b border-black pb-4">
          <h2 className="text-2xl font-display font-bold uppercase tracking-tighter">
            Frequent Inquiries
          </h2>
        </div>

        <div className="space-y-4">
          {SELLER_FAQS.map((faq, i) => (
            <div key={i} className="border border-black/5 group">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center px-10 py-8 text-left transition-colors hover:bg-black/5"
              >
                <span className="text-[10px] font-black tracking-widest uppercase">{faq.q}</span>
                <span className={`text-lg transition-transform duration-300 ${openIndex === i ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-10 pb-10 text-sm font-light leading-relaxed text-black/60">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Ticket Creation */}
      <section className="reveal-support space-y-12 pb-20">
        <div className="border-b border-black pb-4">
          <h2 className="text-2xl font-display font-bold uppercase tracking-tighter">
            Manual Intervention
          </h2>
        </div>

        <div className="space-y-8">
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-black/40">Open Support Ticket</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="DESCRIBE OPERATIONAL DISRUPTION..."
            className="w-full min-h-[200px] bg-gray-50 border-none p-8 text-xs font-black tracking-widest uppercase focus:ring-1 focus:ring-black outline-none placeholder:text-black/10 resize-none"
          />

          <button
            onClick={handleSubmit}
            className="px-12 py-5 bg-black text-white text-[10px] font-black tracking-[0.4em] uppercase hover:bg-black/90 transition-all active:scale-95"
          >
            Initialize Request
          </button>
        </div>
      </section>
    </div>
  );
}
