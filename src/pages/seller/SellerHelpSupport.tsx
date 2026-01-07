import { useState } from "react";
import { motion } from "framer-motion";

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

  function handleSubmit() {
    if (!message.trim()) return;

    window.location.href = `mailto:seller-support@styleai.app?subject=Style.AI Seller Support&body=${encodeURIComponent(
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
          Seller Help & Support
        </h1>
        <p className="text-gray-600 mt-2 text-sm">
          Everything you need to know to start selling confidently on Style.AI.
        </p>
      </motion.div>

      {/* How it works */}
      <section className="rounded-xl border bg-white p-5 space-y-3">
        <h2 className="font-semibold text-gray-900">
          How selling on Style.AI works
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Style.AI helps sellers reach the right buyers using intelligent recommendations.
          You control what products are live using a slot-based system, and only active
          products are shown to buyers. Drafts allow you to prepare listings without
          affecting visibility.
        </p>
      </section>

      {/* FAQs */}
      <section className="space-y-4">
        <h2 className="font-semibold text-gray-900">
          Frequently asked questions
        </h2>

        <div className="space-y-2">
          {SELLER_FAQS.map((faq, i) => (
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
          Need seller support?
        </h2>
        <p className="text-sm text-gray-600">
          Facing an issue with products, slots, or publishing? Tell us what’s wrong.
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your issue here..."
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
