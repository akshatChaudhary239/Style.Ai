import { motion } from "framer-motion";

type Confidence = "high" | "medium" | "low";

type Props = {
  productName: string;
  productId: string;
  confidence: Confidence;
  opinion: string;
  onClose: () => void;
};

export default function RecommendationDetail({
  productName,
  confidence,
  opinion,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="bg-white w-full max-w-2xl p-12 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-black/[0.02] -rotate-45 translate-x-16 -translate-y-16"></div>
        <div className="absolute top-0 left-0 w-2 h-full bg-black"></div>

        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-black/20 hover:text-black transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <div className="space-y-10">
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-display font-bold">Product Evaluation</p>
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase leading-none">
              {productName}
            </h2>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[10px] font-black tracking-widest uppercase py-1 px-3 border border-black">
                Ranking: {confidence}
              </span>
              <span className="text-[10px] font-black tracking-widest uppercase text-black/40">Verified by Style.AI</span>
            </div>
          </div>

          <div className="relative p-10 bg-gray-50 border-l border-black/10">
            <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 mb-6 font-bold font-display italic">Expert Technical Opinion</p>
            <p className="text-xl md:text-2xl font-light italic text-black/80 leading-relaxed">
              “{opinion}”
            </p>
            {/* Quote marks decorative */}
            <span className="absolute top-4 right-8 text-6xl font-display font-black text-black/[0.03]">“</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="flex-1 bg-black text-white py-4 text-[10px] font-black tracking-[0.4em] uppercase hover:bg-black/90 transition-all">
              Check Availability
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-black text-black py-4 text-[10px] font-black tracking-[0.4em] uppercase hover:bg-black hover:text-white transition-all"
            >
              Close Analysis
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
