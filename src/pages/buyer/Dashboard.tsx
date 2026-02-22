import AppNavbar from "@/components/AppNavbar";
import { Outlet, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { StyleContextProvider } from "@/context/StyleContext";
import { useRef, useEffect } from "react";
import gsap from "gsap";

function BuyerLayoutInner() {
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(sidebarRef.current, {
      x: -50,
      opacity: 0,
      duration: 1,
    })
      .from(contentRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
      }, "-=0.6");
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-body selection:bg-black selection:text-white">
      <AppNavbar />

      <div className="flex pt-16 lg:pt-20">
        {/* SIDEBAR  DESKTOP ONLY */}
        <aside
          ref={sidebarRef}
          className="hidden lg:flex w-[300px] h-[calc(100vh-80px)] bg-black text-white p-10 flex-col sticky top-20 border-r border-white/10"
        >
          {/* Brand/Indicator */}
          <div className="mb-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 font-display">
              Management
            </p>
            <h2 className="text-2xl font-display font-bold tracking-tighter">
              Style.AI
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-6 flex-1">
            <NavItem to="/buyer" label="Overview" end />
            <NavItem to="/buyer/recommendations" label="Insights" />
            <NavItem to="/buyer/liked" label="Favorites" />
            <NavItem to="/buyer/Profile" label="Identity" />
            <NavItem to="/buyer/Help" label="Assistance" />
          </nav>

          {/* Luxury Indicator */}
          <div className="mt-auto pt-10 border-t border-white/10 opacity-30">
            <p className="text-[10px] uppercase tracking-widest leading-relaxed">
              Precision Crafted <br /> by Style.AI
            </p>
          </div>
        </aside>

        {/* MAIN AREA */}
        <main
          ref={contentRef}
          className="flex-1 w-full px-6 md:px-12 lg:px-16 py-8 sm:py-12 min-h-screen bg-[#fafafa]"
        >
          {/* CONTENT WRAPPER */}
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

/* Sidebar items */
function NavItem({
  to,
  label,
  end,
}: {
  to: string;
  label: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `
        group flex items-center justify-between py-2 text-sm tracking-widest uppercase transition-all duration-300
        ${isActive
          ? "text-white font-bold translate-x-2"
          : "text-white/40 hover:text-white"
        }
      `
      }
    >
      <span>{label}</span>
      <span className={`w-1 h-1 rounded-full bg-white transition-opacity duration-300 group-hover:opacity-100 ${({ isActive }: any) => isActive ? 'opacity-100' : 'opacity-0'}`}></span>
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
