import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { becomeSeller } from "@/lib/seller-api";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function BecomeSeller() {
  const { user } = useAuth();
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

      await becomeSeller({
        store_name: storeName,
        business_type: businessType,
        location,
      });

      toast({
        title: "Seller account created ✔",
        description: "Welcome to the seller dashboard",
      });

      navigate("/seller/SellerDashboard");
    } catch (err: unknown) {
  const message =
    err instanceof Error ? err.message : "Something went wrong";

  toast({
    title: "Error",
    description: message,
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
