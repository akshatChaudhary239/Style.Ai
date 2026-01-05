import { motion } from "framer-motion";
import { useStyleContext } from "@/context/StyleContext";
import ContextBadge from "./ContextBadge";

export default function BuyerHome() {
  const {
    draftContext,
    appliedContext,
    setDraftContext,
    applyContext,
  } = useStyleContext();

  const MOCK_PRODUCTS = [
    { id: 1, name: "Elegant Kurta Set", occasion: "wedding" },
    { id: 2, name: "Casual Oversized Tee", occasion: "casual" },
    { id: 3, name: "Formal Office Shirt", occasion: "office" },
  ];

  const visibleProducts = appliedContext.occasion
    ? MOCK_PRODUCTS.filter(
        (p) => p.occasion === appliedContext.occasion
      )
    : MOCK_PRODUCTS;

  return (
    <div className="space-y-10">
      {/* Context Badge */}
      <ContextBadge
        draftContext={draftContext}
        appliedContext={appliedContext}
        onApply={applyContext}
        onEdit={() => {
          setDraftContext({ occasion: "wedding" }); // TEMP
        }}
      />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Welcome back 👋
        </h1>
        <p className="text-gray-500 mt-2 max-w-xl">
          Style.AI is ready whenever you are. Explore pieces picked just for you.
        </p>
      </motion.div>

      {/* Recommendations */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          Recommended for you
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition overflow-hidden"
            >
              {/* Image */}
              <div className="h-44 bg-gradient-to-br from-gray-100 to-gray-200" />

              {/* Content */}
              <div className="p-4">
                <h3 className="font-medium text-gray-900">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Ideal for {product.occasion}
                </p>

                <button className="mt-4 text-sm font-medium text-gray-900 underline underline-offset-4 hover:opacity-70">
                  View details →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recently Liked */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          Recently liked
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="min-w-[180px] bg-white border rounded-xl p-3 shadow-sm"
            >
              <div className="h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-2" />
              <p className="text-sm font-medium text-gray-800">
                Liked item
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DEBUG — REMOVE BEFORE PROD */}
      <pre className="hidden text-xs bg-black text-green-400 p-3 rounded">
        {JSON.stringify({ draftContext, appliedContext }, null, 2)}
      </pre>
    </div>
  );
}
