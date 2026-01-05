import { useEffect, useState } from "react";
import { fetchActiveProducts } from "@/recommendation/fetchProducts";
import { recommendProducts } from "@/recommendation/recommendProducts";
import { useStyleContext } from "@/context/StyleContext";
import { Product } from "@/recommendation/types";

export default function BuyerRecommendations() {
  const { appliedContext } = useStyleContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveProducts().then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading recommendations...</div>;

  const recommendations = recommendProducts(products, appliedContext);

  if (recommendations.length === 0) {
    return <div>No matching items found yet.</div>;
  }

  return (
    <div>
      {recommendations.map((rec) => (
        <div key={rec.product.id}>
          <h3>{rec.product.name}</h3>
          <p>{rec.opinion}</p>

        </div>
      ))}
    </div>
  );
}
