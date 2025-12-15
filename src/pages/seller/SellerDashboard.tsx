import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0);

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
      const { data: seller } = await supabase
        .from("seller_profile")
        .select("store_name, total_credits")
        .eq("id", user.id)
        .single();

      if (!seller) {
        navigate("/", { replace: true });
        return;
      }

      setStoreName(seller.store_name);
      setCredits(seller.total_credits);
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
        <h1 className="text-2xl font-bold mb-4">
          Welcome, {storeName}
        </h1>

        <div className="grid grid-cols-3 gap-6">
          <div className="border rounded-xl p-4">
            <h3 className="text-sm text-muted-foreground">Credits Available</h3>
            <p className="text-3xl font-bold mt-2">{credits}</p>
          </div>

          <div className="border rounded-xl p-4 opacity-50">
            <h3 className="text-sm text-muted-foreground">Products Uploaded</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>

          <div className="border rounded-xl p-4 opacity-50">
            <h3 className="text-sm text-muted-foreground">Times Recommended</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
        </div>

        {/* Placeholder */}
        <div className="mt-10 border-dashed border-2 rounded-xl p-8 text-center text-muted-foreground">
          Upload system & credit purchase coming next
        </div>
      </main>
    </div>
  );
}
