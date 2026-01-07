import AppNavbar from "@/components/AppNavbar";
import { Outlet, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { StyleContextProvider } from "@/context/StyleContext";

function BuyerLayoutInner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <AppNavbar />

      <div className="flex">
        {/* SIDEBAR */}
        <aside className="hidden md:flex w-[260px] min-h-[calc(100vh-56px)] bg-white border-r px-5 py-6 flex-col">
          {/* Brand */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Personal Stylist
            </p>
            <h2 className="text-xl font-semibold text-gray-900">
              Style.AI
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 flex-1">
            <NavItem to="/buyer" label="Home" icon="🏠" end />
            <NavItem to="/buyer/recommendations" label="Style.AI" icon="🧠" />
            <NavItem to="/buyer/liked" label="Liked Clothes" icon="❤️" />
            <NavItem to="/buyer/profile" label="Profile" icon="🧍" />
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

        {/* MAIN AREA */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* SOFT BANNER */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-xl border bg-gradient-to-r from-slate-100 to-gray-50 p-4 sm:p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <motion.span
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15 }}
                className="text-lg"
              >
                ✨
              </motion.span>

              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                  Your style, simplified
                </h3>
                <p className="text-sm text-gray-600 mt-1 max-w-xl">
                  Tell Style.AI what you’re dressing for  we’ll take care of the rest.
                </p>
              </div>
            </div>
          </motion.div>

          {/* PAGE CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl p-5 sm:p-6 shadow-sm"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

/* Sidebar item extracted for clarity */
function NavItem({
  to,
  label,
  icon,
  end,
}: {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
          isActive
            ? "bg-gray-700 text-white font-medium"
            : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

export default function BuyerLayout() {
  return (
    <StyleContextProvider>
      <BuyerLayoutInner />
    </StyleContextProvider>
  );
}
