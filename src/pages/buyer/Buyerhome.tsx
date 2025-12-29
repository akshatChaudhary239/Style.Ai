import { useStyleContext } from "@/context/StyleContext";
import ContextBadge from "./ContextBadge";

export default function BuyerHome() {
  const {
    draftContext,
    appliedContext,
    setDraftContext,
    applyContext,
  } = useStyleContext();

  return (
    <div className="space-y-8">
      {/* Context Badge */}
      <ContextBadge
        draftContext={draftContext}
        appliedContext={appliedContext}
        onApply={applyContext}
        onEdit={() => {
          // later: open StylistChat modal
          setDraftContext({ occasion: "wedding" }); // TEMP TEST
        }}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back 👋</h1>
        <p className="text-gray-500 mt-1">
          Here’s what we think you’ll love today.
        </p>
      </div>

      {/* TEMP DEBUG — REMOVE LATER */}
      <pre className="text-xs bg-black text-green-400 p-3 rounded">
        {JSON.stringify({ draftContext, appliedContext }, null, 2)}
      </pre>



      {/* Recommended Section */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          Recommended for you
        </h2>

        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border p-4 hover:shadow-md transition"
            >
              <div className="h-40 bg-gray-100 rounded-lg mb-3" />

              <h3 className="font-medium">Clothing Item</h3>
              <p className="text-sm text-gray-500">
                Nearby store • Sector 14
              </p>

              <button className="mt-3 text-sm text-pink-600">
                ❤️ Like
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Liked Section */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          Recently liked
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[180px] bg-white border rounded-xl p-3"
            >
              <div className="h-28 bg-gray-100 rounded-lg mb-2" />
              <p className="text-sm font-medium">Liked item</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
