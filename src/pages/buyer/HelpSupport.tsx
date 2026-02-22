import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const FAQS = [
  {
    q: "HOW DOES STYLE.AI RECOMMEND CLOTHES?",
    a: "Our engine synthesizes biometric profile data with real-time intent parameters to identify optimal silhouettes and textures."
  },
  {
    q: "WHY ARE RECOMMENDATIONS LIMITED?",
    a: "The system prioritizes precision over volume. Try expanding your intent parameters or relaxing secondary preferences."
  },
  {
    q: "DATA PRIVACY PROTOCOLS?",
    a: "Personal data is shielded. Sellers only interact with anonymized product analytics. Your aesthetic identity is yours alone."
  },
  {
    q: "MODIFYING IDENTITY PARAMETERS?",
    a: "You can recalibrate your profile at any time. Style.AI will instantly re-process all active recommendations."
  },
];

export default function HelpSupport() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal-item", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  function handleSubmit() {
    if (!message.trim()) return;
    window.location.href = `mailto:support@styleai.app?subject=IDENTITY ASSISTANCE&body=${encodeURIComponent(
      message
    )}`;
    setMessage("");
  }

  return (
    <div ref={containerRef} className="w-full max-w-4xl space-y-20 py-10">
      {/* Header */}
      <section className="reveal-item space-y-4">
        <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-display">Identity / Support</p>
        <h1 className="text-6xl md:text-7xl font-display font-black tracking-tighter uppercase leading-none text-black">
          Assistance <br />
          <span className="text-black/10">Protocols</span>
        </h1>
        <p className="text-lg text-black/60 max-w-xl font-light leading-relaxed">
          Comprehensive documentation for the Style.AI ecosystem.
        </p>
      </section>

      {/* How it works */}
      <section className="reveal-item border border-black p-10 space-y-6">
        <h2 className="text-xl font-display font-bold uppercase tracking-tight">
          System Synthesis
        </h2>
        <p className="text-base text-black/60 font-light leading-relaxed">
          Style.AI is not a random discovery tool. It is a precise analytical framework that evaluates
          the intersection of your biometric profile and your contextual intent (e.g., Wedding, Corporate, Editorial).
          Every suggestion is backed by visual reasoning.
        </p>
      </section>

      {/* FAQs */}
      <section className="space-y-12">
        <div className="reveal-item border-b border-black pb-4">
          <h2 className="text-xl font-display font-bold uppercase tracking-tighter">
            Frequent Inquiries
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="reveal-item border border-black/5 bg-white group"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === i ? null : i)
                }
                className="w-full flex justify-between items-center px-8 py-6 text-left"
              >
                <span className="text-xs font-black tracking-[0.2em] uppercase">
                  {faq.q}
                </span>
                <span className={`text-black transition-transform duration-300 ${openIndex === i ? 'rotate-45' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
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
                    <div className="px-8 pb-8 text-sm text-black/60 font-light leading-relaxed border-t border-black/5 pt-6">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Box */}
      <section className="reveal-item space-y-12">
        <div className="border-b border-black pb-4">
          <h2 className="text-xl font-display font-bold uppercase tracking-tighter">
            Direct Communication
          </h2>
        </div>

        <div className="space-y-8">
          <p className="text-sm uppercase tracking-widest text-black/40 font-bold">
            Submit a support ticket for system recalibration issues.
          </p>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="DETAILS OF SYSTEM ISSUE..."
            className="w-full min-h-[160px] bg-gray-50 border-none p-8 text-xs font-black tracking-widest uppercase focus:ring-1 focus:ring-black outline-none placeholder:text-black/20"
          />

          <button
            onClick={handleSubmit}
            className="px-12 py-5 bg-black text-white text-[10px] font-black tracking-[0.4em] uppercase hover:bg-black/90 transition-all"
          >
            Dispatch Message
          </button>
        </div>
      </section>
    </div>
  );
}
