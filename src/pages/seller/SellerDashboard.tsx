import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [totalSlots, setTotalSlots] = useState<number>(0);
  const [usedSlots, setUsedSlots] = useState<number>(0);
  const availableSlots = totalSlots - usedSlots;
  useEffect(() => {
    async function checkSeller() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth", { replace: true });
        return;
      }

      // Check role
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("active_role")
        .eq("id", user.id)
        .single();

      if (profile?.active_role !== "seller") {
        navigate("/", { replace: true });
        return;
      }

      // Fetch seller profile
const { data: seller, error } = await supabase
  .from("seller_profile")
  .select("store_name, total_slots, used_slots")
  .eq("id", user.id)
  .single();

if (error || !seller) {
  navigate("/", { replace: true });
  return;
}

setStoreName(seller.store_name);
setTotalSlots(seller.total_slots);
setUsedSlots(seller.used_slots);
setLoading(false);

    }

    checkSeller();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }


  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/5 bg-muted p-4">
        <h2 className="font-semibold text-lg mb-6">{storeName}</h2>

        <ul className="space-y-4 text-sm">
          <li className="font-medium">Dashboard</li>
          <li className="text-muted-foreground">Credits</li>
          <li className="text-muted-foreground">Uploads</li>
          <li className="text-muted-foreground">Growth</li>
          <li className="text-muted-foreground">Help</li>
        </ul>
      </aside>

      {/* Main Panel */}
      

      <main className="flex-1 p-8">
<div className="grid grid-cols-3 gap-6 mb-10">
  <div className="border rounded-xl p-4">
    <p className="text-sm text-muted-foreground">Total Slots</p>
    <p className="text-3xl font-bold">{totalSlots}</p>
  </div>

  <div className="border rounded-xl p-4">
    <p className="text-sm text-muted-foreground">Used Slots</p>
    <p className="text-3xl font-bold">{usedSlots}</p>
  </div>

  <div className="border rounded-xl p-4">
    <p className="text-sm text-muted-foreground">Available Slots</p>
    <p
      className={`text-3xl font-bold ${
        availableSlots === 0 ? "text-red-500" : "text-green-600"
      }`}
    >
      {availableSlots}
    </p>
  </div>
</div>
{availableSlots === 0 ? (
  <div className="border-2 border-dashed rounded-xl p-8 text-center">
    <p className="text-lg font-medium mb-2">
      No upload slots available
    </p>
    <p className="text-sm text-muted-foreground mb-4">
      Buy more slots to upload new products
    </p>
    <button
      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
      onClick={() => alert("Slot purchase coming soon")}
    >
      Buy More Slots
    </button>
  </div>
) : (
  <div className="border-2 border-dashed rounded-xl p-8 text-center">
    <p className="text-lg font-medium mb-2">
      You can upload {availableSlots} more product(s)
    </p>
    <p className="text-sm text-muted-foreground">
      Upload system coming next
    </p>
  </div>
)}



        {/* Placeholder */}
        <div className="mt-10 border-dashed border-2 rounded-xl p-8 text-center text-muted-foreground">
          Upload system & credit purchase coming next
        </div>
      </main>
    </div>
  );
}
