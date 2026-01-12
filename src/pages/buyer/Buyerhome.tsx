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
    <div className="w-full space-y-12">
      {/* Context Badges */}
      <ContextBadge
        draftContext={draftContext}
        appliedContext={appliedContext}
        onApply={applyContext}
        onEdit={() => {
          setDraftContext({ occasion: "wedding" }); // TEMP
        }}
      />

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2"
      >
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight">
          Welcome back 👋
        </h1>
        <p className="text-sm sm:text-base text-gray-500 max-w-xl">
          Style.AI is ready whenever you are. Explore pieces picked just for you.
        </p>
      </motion.div>

      {/* RECOMMENDED */}
      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-semibold">
          Recommended for you
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.97 }}
              className="
                bg-white
                rounded-2xl
                border
                shadow-sm
                hover:shadow-md
                transition
                overflow-hidden
              "
            >
              {/* Image */}
              <div className="h-40 sm:h-44 bg-gradient-to-br from-gray-100 to-gray-200" />

              {/* Content */}
              <div className="p-4 space-y-1">
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Ideal for {product.occasion}
                </p>

                <button className="mt-3 text-sm font-medium text-blue-700 underline underline-offset-4 hover:opacity-80">
                  View details →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RECENTLY LIKED */}
      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-semibold">
          Recently liked
        </h2>

        <div className="
          flex gap-4
          overflow-x-auto
          pb-4
          -mx-4 px-4
          snap-x snap-mandatory
        ">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="
                min-w-[160px] sm:min-w-[180px]
                bg-white
                border
                rounded-xl
                p-3
                shadow-sm
                snap-start
              "
            >
              <div className="h-24 sm:h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-2" />
              <p className="text-sm font-medium text-gray-800">
                Liked item
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DEBUG */}
      <pre className="hidden text-xs bg-black text-green-400 p-3 rounded">
        {JSON.stringify({ draftContext, appliedContext }, null, 2)}
      </pre>
    </div>
  );
}
