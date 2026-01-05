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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <div>
          <h2 className="text-xl font-semibold">{productName}</h2>
          <p className="text-sm text-gray-500 mt-1 capitalize">
            Confidence: {confidence}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-sm italic text-gray-700">
          “{opinion}”
        </div>
      </div>
    </div>
  );
}
