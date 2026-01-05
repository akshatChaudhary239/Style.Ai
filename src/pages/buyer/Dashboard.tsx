import AppNavbar from "@/components/AppNavbar";
import { Outlet } from "react-router-dom";

import { StyleContextProvider, useStyleContext } from "@/context/StyleContext";
import { NavLink } from "react-router-dom";


function BuyerLayoutInner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <AppNavbar />

      <div className="flex">
        {/* SIDEBAR */}
        <aside className="hidden md:flex w-[260px] min-h-[calc(100vh-56px)] bg-white border-r px-5 py-6 flex-col">
          {/* Brand */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Personal Stylist
            </p>
            <h2 className="text-xl font-semibold text-gray-900">
              Style.AI
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 flex-1">
            {[
              { to: "/buyer", label: "Home", icon: "🏠" },
              { to: "/buyer/recommendations", label: "Style.AI", icon: "🧠" },
              { to: "/buyer/liked", label: "Liked Clothes", icon: "❤️" },
              { to: "/buyer/profile", label: "Profile", icon: "🧍" },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-gray-900 text-white font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t pt-4 space-y-2 text-sm text-gray-500">
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100">
              🛒 Cart (coming soon)
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100">
              ❓ Help & Support
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Engagement Banner */}
          <div className="rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 text-white p-6 shadow">
            <h3 className="text-lg font-semibold mb-1">
              Your style, simplified
            </h3>
            <p className="text-sm text-gray-200 max-w-xl">
              Tell Style.AI what you’re dressing for — we’ll handle the rest.
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <Outlet />
          </div>
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
