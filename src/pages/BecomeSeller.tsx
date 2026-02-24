import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { becomeSeller } from "@/lib/seller-api";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { syncUserRoleAndSession } from "@/lib/auth-sync";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function BecomeSeller() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [storeName, setStoreName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [location, setLocation] = useState("");

  async function handleSubmit() {
    if (!user) {
      toast({ title: "Not logged in", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);

      // 1. Call the RPC to create the seller record
      await becomeSeller({
        store_name: storeName,
        business_type: businessType,
        location,
      });

      // 2. Sync the session and fetch latest profile (this verifies role change in DB)
      const result = await syncUserRoleAndSession();

      // 3. Update global auth state so UI reacts immediately
      await refreshUser();

      toast({
        title: "Seller account created",
        description: "Welcome to your shop dashboard",
      });

      // 4. Navigate to the dashboard or destination determined by sync
      navigate(result?.destination || "/seller/dashboard", { replace: true });

    } catch (err: any) {
      toast({
        title: "Submission failed",
        description: err.message || "Could not create seller profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Become a Seller</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Store Name</Label>
            <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </div>

          <div>
            <Label>Business Type</Label>
            <Input value={businessType} onChange={(e) => setBusinessType(e.target.value)} />
          </div>

          <div>
            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Creating seller..." : "Become a Seller"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
