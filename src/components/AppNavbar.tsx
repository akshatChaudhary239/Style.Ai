import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Role = "buyer" | "seller";

export default function AppNavbar() {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActiveRole();
  }, []);

  async function fetchActiveRole() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("user_profiles")
      .select("active_role")
      .eq("id", user.id)
      .single();

if (data?.active_role === "buyer" || data?.active_role === "seller") {
  setActiveRole(data.active_role);
}

  }

  async function switchRole() {
    if (!activeRole) return;

    setLoading(true);
    const newRole: Role = activeRole === "seller" ? "buyer" : "seller";

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("user_profiles")
      .update({ active_role: newRole })
      .eq("id", user.id);

    if (!error) {
      setActiveRole(newRole);
      navigate(newRole === "seller" ? "/seller" : "/buyer");
    }

    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate("/auth");
  }

  return (
    <div className="w-full h-14 px-6 flex items-center justify-between border-b">
      {/* LEFT */}
      <div className="font-bold text-lg">Style.AI</div>

      {/* CENTER (ROLE-BASED NAV) */}
      <div className="flex gap-4">
        {activeRole === "seller" && (
          <>
            <button onClick={() => navigate("/seller/SellerDashboard")}>Dashboard</button>
            <button onClick={() => navigate("/seller/productLists")}>Products</button>
          </>
        )}

        {activeRole === "buyer" && (
          <>
            <button onClick={() => navigate("/buyer")}>Discover</button>
            <button onClick={() => navigate("/buyer/favorites")}>Favorites</button>
          </>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex gap-3 items-center">
        {activeRole && (
          <button
            onClick={switchRole}
            disabled={loading}
            className="border px-3 py-1 rounded"
          >
            Switch to {activeRole === "seller" ? "Buyer" : "Seller"}
          </button>
        )}

        <button
          onClick={logout}
          className="border px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
