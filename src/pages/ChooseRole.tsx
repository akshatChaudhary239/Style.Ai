import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function ChooseRole() {
  const navigate = useNavigate();

  async function chooseBuyer() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Not logged in", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from("user_profiles")
      .update({
        roles: ["buyer"],
        active_role: "buyer",
      })
      .eq("id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    navigate("/profile");
  }

  async function chooseSeller() {
    navigate("/become-seller");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-2xl font-semibold">How do you want to continue?</h1>

      <Button size="lg" onClick={chooseBuyer}>
        Continue as Buyer
      </Button>

      <Button size="lg" variant="outline" onClick={chooseSeller}>
        Become a Seller
      </Button>
    </div>
  );
}
