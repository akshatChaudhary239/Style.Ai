import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Welcome to Style.AI</h1>
      <p className="text-muted-foreground">
        Discover styles like never before. Sell fashion. One platform.
      </p>

      <Button
        size="lg"
        onClick={() => navigate("/app")}
      >
        Enter App
      </Button>
    </div>
  );
}
