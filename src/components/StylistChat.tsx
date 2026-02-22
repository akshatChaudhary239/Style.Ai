import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStyleContext } from "@/context/StyleContext";
import { parseIntent } from "@/utils/parseIntent";

const SUGGESTED_PROMPTS = [
  "WEDDING ATTIRE",
  "EDITORIAL PARTY",
  "MINIMALIST OFFICE",
  "CASUAL UTILITY",
  "TRENDING LOCALLY",
];

export default function StylistChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const { setDraftContext } = useStyleContext();

  function handleSend(text: string) {
    if (!text.trim()) return;

    const ctx = parseIntent(text);
    setDraftContext(ctx);

    setConfirmation("IDENTITY UPDATED — RECALIBRATING RECOMMENDATIONS");
    setInput("");

    // Auto close after brief success message
    setTimeout(() => {
      setOpen(false);
      setConfirmation(null);
    }, 2000);
  }

  return (
    <>
      {/* Floating Button - Redesigned to be a sleek side tab or bottom bar */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-10 right-10 z-40 bg-black text-white px-8 py-4 flex items-center gap-4 hover:scale-105 transition-all duration-300 shadow-2xl group border border-white/10"
      >
        <span className="w-2 h-2 rounded-full bg-white group-hover:animate-pulse"></span>
        <span className="text-[10px] font-display font-black uppercase tracking-[0.4em]">
          Define Intent
        </span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="bg-white w-full max-w-2xl p-12 relative overflow-hidden"
            >
              {/* Decorative side bar */}
              <div className="absolute top-0 left-0 w-2 h-full bg-black"></div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setOpen(false);
                  setConfirmation(null);
                }}
                className="absolute top-8 right-8 text-black/20 hover:text-black transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>

              {/* Header */}
              <div className="mb-12 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-display font-bold">Identity Protocol</p>
                <h2 className="text-4xl font-display font-black tracking-tighter uppercase leading-none">
                  Define Your Aesthetic
                </h2>
                <p className="text-sm text-black/40 font-light">
                  Input your current context or occasion to initiate system recalibration.
                </p>
              </div>

              {/* Suggested Prompt */}
              <div className="flex flex-wrap gap-3 mb-12">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="px-4 py-2 text-[10px] font-black tracking-widest border border-black/5 hover:bg-black hover:text-white transition-all duration-300 uppercase"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Confirmations */}
              <AnimatePresence>
                {confirmation && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-8 text-[10px] font-black tracking-widest text-black flex items-center gap-3"
                  >
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping"></span>
                    {confirmation}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input */}
              {!confirmation && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="E.G. MINIMALIST WEDDING IN PARIS..."
                    className="flex-1 bg-gray-50 border-none px-6 py-4 text-xs font-black tracking-widest uppercase focus:ring-1 focus:ring-black outline-none placeholder:text-black/20"
                    onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                  />
                  <button
                    onClick={() => handleSend(input)}
                    className="bg-black text-white px-10 py-4 text-[10px] font-black tracking-widest uppercase hover:bg-black/90 transition-all active:scale-95"
                  >
                    Initiate
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
