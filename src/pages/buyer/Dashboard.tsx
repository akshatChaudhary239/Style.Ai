import AppNavbar from "@/components/AppNavbar";
import { Outlet } from "react-router-dom";
import BuyerHome from "./Buyerhome";
import StylistChat from "@/components/StylistChat";
import { StyleContextProvider, useStyleContext } from "@/context/StyleContext";

function BuyerLayoutInner()  {
   const { context } = useStyleContext();
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar />

      <div className="flex">
        {/* SIDEBAR (20%) */}
        <aside className="w-[20%] min-h-[calc(100vh-56px)] bg-white border-r px-4 py-6">
          <nav className="flex flex-col gap-3">
            <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100">
              🏠 Home
            </button>
            <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100">
              ✨ Recommendations
            </button>
            <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100">
              ❤️ Liked Clothes
            </button>
            <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100">
              🧍 Profile
            </button>

            <div className="mt-6 border-t pt-4">
              <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-500">
                🛒 Cart (coming soon)
              </button>
              <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-500">
                ❓ Help & Support
              </button>
            </div>
          </nav>
        </aside>
        

        {/* MAIN CONTENT (80%) */}
        <main className="w-[80%] p-8 space-y-4">
          {/* Debug div */}
          {Object.keys(context).length > 0 && (
            <div className="text-sm text-gray-500 bg-white border rounded px-3 py-2">
              Applying filters: {JSON.stringify(context)}
            </div>
          )}

          <BuyerHome />
          <StylistChat />
        </main>
       
      </div>
      
    </div>
  );
}
export default function BuyerLayout() {
  return (
    <StyleContextProvider>
      <BuyerLayoutInner />
    </StyleContextProvider>
  );
}
