import { useState } from "react";
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

    setConfirmation("Got it. I’ll keep this in mind ✨");
    setInput("");
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-black text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition"
      >
        💬 Ask your stylist
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white w-full sm:w-[420px] rounded-t-2xl sm:rounded-2xl p-5">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">
                What are you shopping for today?
              </h2>
              <button
                onClick={() => {
                  setOpen(false);
                  setConfirmation(null);
                }}
                className="text-gray-400"
              >
                ✕
              </button>
            </div>

            {/* Suggested prompts */}
            <div className="flex flex-wrap gap-2 mb-4">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Confirmation */}
            {confirmation && (
              <div className="mb-3 text-sm text-green-600">
                {confirmation}
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type something like 'wedding outfits'..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
              />
              <button
                onClick={() => handleSend(input)}
                className="bg-black text-white px-4 rounded-lg text-sm"
              >
                Send
              </button>
            </div>

          </div>  
        </div>
      )}
    </>
  );
}
