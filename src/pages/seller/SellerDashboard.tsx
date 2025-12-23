import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Outlet, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ProductList from "./ProductList";
import ProductEditor from "./ProductEditor";
import { Database } from "@/integrations/supabase/types";
import AppNavbar from "@/components/AppNavbar";

type Product =
  Database["public"]["Tables"]["products"]["Row"];



type Panel = "none" | "products" | "create" | "edit";



export default function SellerDashboard() {
  const navigate = useNavigate();

const [selectedProduct, setSelectedProduct] =
  useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [totalSlots, setTotalSlots] = useState(0);
  const [usedSlots, setUsedSlots] = useState(0);

  const [activePanel, setActivePanel] = useState<Panel>("none");

  const availableSlots = totalSlots - usedSlots;

  useEffect(() => {
    async function checkSeller() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/auth", { replace: true });
        return;
      }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("active_role")
        .eq("id", user.id)
        .single();

      if (profile?.active_role !== "seller") {
        navigate("/", { replace: true });
        return;
      }

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
  async function fetchSellerSlots() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data } = await supabase
    .from("seller_profile")
    .select("total_slots, used_slots")
    .eq("id", user.id)
    .single();

  if (data) {
    setTotalSlots(data.total_slots);
    setUsedSlots(data.used_slots);
  }
}


  return (
      <>
      <AppNavbar />
      <Outlet/>


      <div className={`flex h-screen ${activePanel !== "none" ? "blur-sm pointer-events-none" : ""}`}> 
       {/* Sidebar */}
       <aside className="w-1/5 bg-muted p-4">
        <h2 className="font-semibold text-lg mb-6">{storeName}</h2>

        <ul className="space-y-4 text-sm">
          <li className="font-medium cursor-pointer">Dashboard</li>

          <li
            className="cursor-pointer"
            onClick={() => setActivePanel("products")}
          >
            Products
          </li>

          <li className="text-muted-foreground">Growth</li>
          <li className="text-muted-foreground">Help</li>
        </ul>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 relative">
        {/* Overview cards */}
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

        {/* Upload CTA */}
<button
  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
  onClick={() => setActivePanel("create")}
>
  + Upload Product
</button>

        </main>
        </div>
        {/* Overlay Panel */}
        {activePanel !== "none" && (
          <div className="absolute inset-0 bg-black/40 flex justify-center items-start pt-10 z-50">
            <div className="bg-background w-4/5 max-w-5xl rounded-2xl shadow-xl p-6 relative">
              <button
                onClick={() => setActivePanel("none")}
                className="absolute top-4 right-4 text-sm"
              >
                ✕
              </button>

              {activePanel === "products" && (
<ProductList
                onCreate={() => setActivePanel("create")}
                onEdit={(product) => {
                  setSelectedProduct(product);
                  setActivePanel("edit");
                } }
                onStatusChange={fetchSellerSlots} onClose={function (): void {
                  throw new Error("Function not implemented.");
                } }/>


              )}
{activePanel === "edit" && selectedProduct && (
  <ProductEditor
    mode="edit"
    product={selectedProduct}
    onClose={() => setActivePanel("none")}
    onCreated={fetchSellerSlots}
  />
)}

            </div>
          </div>
        )}
      
    
    </>
  );
}
