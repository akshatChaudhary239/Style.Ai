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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        relative
        rounded-2xl
        border
        bg-gradient-to-r
        from-blue-50
        to-sky-50
        p-4 sm:p-5
        shadow-md
      "
    >
      {/* Glow */}
      <div className="absolute -inset-1 rounded-2xl bg-blue-200/30 blur-xl -z-10" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Context Text */}
        <div className="flex items-start gap-3 text-sm">
          <span className="text-lg">
            {isDirty ? "🧠" : "✨"}
          </span>

          <AnimatePresence mode="wait">
            {!hasAppliedContext && !isDirty && (
              <motion.span
                key="profile"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-gray-700"
              >
                Based on your <strong>profile preferences</strong>
              </motion.span>
            )}

            {hasAppliedContext && !isDirty && (
              <motion.span
                key="applied"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-gray-700"
              >
                Showing results for{" "}
                <strong className="text-gray-900">
                  {appliedContext.occasion}
                </strong>
              </motion.span>
            )}

            {isDirty && (
              <motion.span
                key="dirty"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-amber-700"
              >
                New context selected:{" "}
                <strong>{draftContext.occasion}</strong>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isDirty ? (
            <Button
              size="sm"
              onClick={onApply}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply changes
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={onEdit}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Change
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
