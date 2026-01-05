import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Shirt, Footprints, Palette } from "lucide-react";


// --- Simple Clothing Recommendation Engine ---

interface RecommendationResult {
  top: string;
  top_reason: string;
  bottom: string;
  bottom_reason: string;
  shoes: string;
  shoes_reason: string;
  best_colors: string[];
  avoid_colors: string[];
  message: string;
}

function getClothingSuggestions(rec: RecommendationResult) {
  const clothes = [];

  // Basic sample product list (we'll make it more advanced later)
  const allItems = [
    {
      name: "Red Oversized Tee",
      img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      price: "₹799",
      colors: ["red"],
      link: "https://www.myntra.com",
    },
    {
      name: "Black Baggy Jeans",
      img: "https://images.unsplash.com/photo-1602810317721-d6760f84a889",
      price: "₹1299",
      colors: ["black"],
      link: "https://www.ajio.com",
    },
    {
      name: "White Sneakers",
      img: "https://images.unsplash.com/photo-1519741497674-611481863552",
      price: "₹1599",
      colors: ["white"],
      link: "https://www.amazon.in",
    },
    {
      name: "Olive Green Hoodie",
      img: "https://images.unsplash.com/photo-1618354691398-21c2c33c6df6",
      price: "₹999",
      colors: ["olive", "green"],
      link: "https://www.flipkart.com",
    },
  ];

  const goodColors = rec.best_colors || [];

  // Filter items based on matching color palette
  return allItems.filter((item) =>
    item.colors.some((c) => goodColors.includes(c))
  );
}

export default function Recommendation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const rec = state;

  if (!rec) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-lg text-muted-foreground">No recommendations yet.</p>
        <Button onClick={() => navigate("/")}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in">
      {/* Back Button */}
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Title */}
      <h1 className="text-3xl font-display font-bold mb-6 flex items-center gap-2">
        <Sparkles className="text-primary h-7 w-7" />
        Your Personalized Style Recommendation
      </h1>

      {/* Outfit Card */}
      <Card className="shadow-lg border-border/50 mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Outfit Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Top Recommendation */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shirt className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold">Top</p>
              <p className="text-primary font-medium">{rec.top}</p>
              <p className="text-sm text-muted-foreground">{rec.top_reason}</p>
            </div>
          </div>

          {/* Bottom Recommendation */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Footprints className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold">Bottom</p>
              <p className="text-primary font-medium">{rec.bottom}</p>
              <p className="text-sm text-muted-foreground">{rec.bottom_reason}</p>
            </div>
          </div>

          {/* Shoes Recommendation */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Footprints className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold">Shoes</p>
              <p className="text-primary font-medium">{rec.shoes}</p>
              <p className="text-sm text-muted-foreground">{rec.shoes_reason}</p>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Color Card */}
      <Card className="shadow-lg border-border/50 mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Color Guidance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="font-semibold">Best Colors: </span>
            <span className="text-primary">{rec.best_colors.join(", ")}</span>
          </p>
          <p>
            <span className="font-semibold">Avoid Colors: </span>
            <span className="text-destructive">{rec.avoid_colors.join(", ")}</span>
          </p>
        </CardContent>
      </Card>

      {/* Message Card */}
      <Card className="shadow-lg border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Style Coach Says…</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium leading-relaxed">{rec.message}</p>
        </CardContent>
      </Card>
      {/* Clothing Suggestions */}
<div className="mt-10">
  <h2 className="text-2xl font-display font-bold mb-4">
    🔥 Clothes That Match Your Style
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
    {getClothingSuggestions(rec).map((item, index) => (
      <div
        key={index}
        className="rounded-xl p-3 shadow-md border bg-white hover:shadow-lg transition"
      >
        <img
          src={item.img}
          alt={item.name}
          className="rounded-lg w-full h-40 object-cover"
        />
        <h3 className="mt-3 text-lg font-semibold">{item.name}</h3>
        <p className="text-primary font-bold">{item.price}</p>

        <Button
          className="mt-3 w-full"
          onClick={() => window.open(item.link, "_blank")}
        >
          View Product
        </Button>
      </div>
    ))}
  </div>
</div>

    </div>
  );
}
