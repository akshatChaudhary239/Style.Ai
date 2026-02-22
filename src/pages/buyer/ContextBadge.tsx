import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StyleContextState } from "@/context/StyleContext";

type Props = {
  draftContext: StyleContextState;
  appliedContext: StyleContextState;
  onApply: () => void;
  onEdit: () => void;
};

export default function ContextBadge({
  draftContext,
  appliedContext,
  onApply,
  onEdit,
}: Props) {
  const isDirty =
    JSON.stringify(draftContext) !== JSON.stringify(appliedContext);

  const hasAppliedContext =
    Object.keys(appliedContext).length > 0;

  return (
    <div className="relative border-l-4 border-black bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 transition-all duration-500">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 border border-black flex items-center justify-center text-xs font-bold uppercase tracking-widest">
          {isDirty ? "AI" : "OK"}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 font-display">System Context</p>
          <AnimatePresence mode="wait">
            {!hasAppliedContext && !isDirty && (
              <motion.p
                key="profile"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-lg font-display font-medium uppercase tracking-tighter"
              >
                Profile Archetype Activated
              </motion.p>
            )}

            {hasAppliedContext && !isDirty && (
              <motion.p
                key="applied"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-lg font-display font-medium uppercase tracking-tighter"
              >
                Optimized for: <span className="text-black font-black">{appliedContext.occasion}</span>
              </motion.p>
            )}

            {isDirty && (
              <motion.p
                key="dirty"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-lg font-display font-medium uppercase tracking-tighter text-black/80"
              >
                Drafting New Identity: <span className="font-black italic">{draftContext.occasion}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex gap-4">
        {isDirty ? (
          <button
            onClick={onApply}
            className="px-8 py-3 bg-black text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black/90 transition-all duration-300 transform hover:translate-y-[-2px] active:translate-y-0"
          >
            Update Engine
          </button>
        ) : (
          <button
            onClick={onEdit}
            className="px-8 py-3 border border-black text-black text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black hover:text-white transition-all duration-300 transform hover:translate-y-[-2px] active:translate-y-0"
          >
            Refine Intent
          </button>
        )}
      </div>
    </div>
  );
}
