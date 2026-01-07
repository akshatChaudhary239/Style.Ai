import { useState } from "react";
import { motion } from "framer-motion";

const FAQS = [
  {
    q: "How does Style.AI recommend clothes?",
    a: "Style.AI combines your profile preferences (like body type and style) with your current intent (occasion, mood, etc.) to rank clothes that fit you best."
  },
  {
    q: "Why am I not seeing many recommendations?",
    a: "This usually happens when your selected occasion or preferences are very specific. Try changing the occasion or relaxing some preferences."
  },
  {
    q: "Do sellers see my personal data?",
    a: "No. Sellers only see their own product data. Your profile and preferences are private and used only for recommendations."
  },
  {
    q: "Can I change my preferences later?",
    a: "Yes. You can update your profile anytime, and Style.AI will instantly adapt its recommendations."
  },
];

export default function HelpSupport() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  function handleSubmit() {
    if (!message.trim()) return;

    // SIMPLE V1: mailto (upgrade later)
    window.location.href = `mailto:support@styleai.app?subject=Style.AI Support&body=${encodeURIComponent(
      message
    )}`;

    setMessage("");
  }

  return (
    <div className="w-full max-w-3xl space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-semibold text-gray-900">
          Help & Support
        </h1>
        <p className="text-gray-600 mt-2 text-sm">
          Everything you need to understand how Style.AI works.
        </p>
      </motion.div>

      {/* How it works */}
      <section className="rounded-xl border bg-white p-5 space-y-3">
        <h2 className="font-semibold text-gray-900">
          How Style.AI works
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Style.AI is a smart recommendation system. It doesn’t randomly show clothes.
          It evaluates your profile, your current intent (like wedding, office, casual),
          and product features to suggest what fits you best — with clear reasoning.
        </p>
      </section>

      {/* FAQs */}
      <section className="space-y-4">
        <h2 className="font-semibold text-gray-900">
          Frequently asked questions
        </h2>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="border rounded-lg bg-white"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === i ? null : i)
                }
                className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-medium"
              >
                {faq.q}
                <span className="text-gray-400">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>

              {openIndex === i && (
                <div className="px-4 pb-3 text-sm text-gray-600">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Box */}
      <section className="rounded-xl border bg-white p-5 space-y-4">
        <h2 className="font-semibold text-gray-900">
          Still need help?
        </h2>
        <p className="text-sm text-gray-600">
          Describe your problem and we’ll get back to you.
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your issue here..."
          className="w-full min-h-[120px] border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />

        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
        >
          Send message
        </button>
      </section>
    </div>
  );
}
