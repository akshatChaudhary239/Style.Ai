import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStyleContext } from "@/context/StyleContext";
import { parseIntent } from "@/utils/parseIntent";

const SUGGESTED_PROMPTS = [
  "Wedding outfits",
  "Party wear",
  "Office clothes",
  "Casual daily",
  "Something trendy near me",
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

    setConfirmation("Got it — I’ll keep this in mind.");
    setInput("");
  }

  return (
    <>
      {/* Floating Buttons */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gray-900 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2"
      >
        <span>💬</span>
        <span className="hidden sm:inline text-sm font-medium">
          Ask your stylist
        </span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center"
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white w-full sm:w-[420px] rounded-t-2xl sm:rounded-2xl p-5 shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-lg">
                    Tell me your vibe
                  </h2>
                  <p className="text-sm text-gray-500">
                    I’ll tailor recommendations for you
                  </p>
                </div>

                <button
                  onClick={() => {
                    setOpen(false);
                    setConfirmation(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Suggested Prompt */}
              <div className="flex flex-wrap gap-2 mb-4">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="px-3 py-1.5 text-sm bg-gray-100 rounded-full hover:bg-gray-200 transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Confirmations */}
              <AnimatePresence>
                {confirmation && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-3 text-sm text-green-600"
                  >
                    {confirmation}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. wedding outfits, office wear..."
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                />
                <button
                  onClick={() => handleSend(input)}
                  className="bg-gray-900 text-white px-4 rounded-lg text-sm hover:opacity-90 transition"
                >
                  Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
