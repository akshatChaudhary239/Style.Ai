import AppNavbar from "@/components/AppNavbar";
import { Outlet } from "react-router-dom";

import { StyleContextProvider, useStyleContext } from "@/context/StyleContext";
import { NavLink } from "react-router-dom";


function BuyerLayoutInner()  {

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar />

      <div className="flex">
        {/* SIDEBAR (20%) */}
        <aside className="w-[20%] min-h-[calc(100vh-56px)] bg-white border-r px-4 py-6">
    <nav className="flex flex-col gap-3">
  <NavLink
    to="/buyer"
    className={({ isActive }) =>
      `text-left px-3 py-2 rounded-lg ${
        isActive
          ? "bg-pink-100 text-pink-600"
          : "hover:bg-gray-100"
      }`
    }
  >
    🏠 Home
  </NavLink>

  <NavLink
   to="/buyer/recommendations"  
    className={({ isActive }) =>
      `text-left px-3 py-2 rounded-lg ${
        isActive
          ? "bg-pink-100 text-pink-600"
          : "hover:bg-gray-100"
      }`
    }
  >
    🧠 Style.AI
  </NavLink>

  <NavLink
    to="/buyer/liked"
    className="text-left px-3 py-2 rounded-lg hover:bg-gray-100"
  >
    ❤️ Liked Clothes
  </NavLink>

  <NavLink
    to="/buyer/profile"
    className="text-left px-3 py-2 rounded-lg hover:bg-gray-100"
  >
    🧍 Profile
  </NavLink>

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
  <Outlet />
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
