import { useState,useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";


const MAX_IMAGES = 5;
type Product =
  Database["public"]["Tables"]["products"]["Row"];

type Mode = "create" | "edit";

export default function ProductEditor({
  mode,
  product,
  onClose,
  onCreated,
}: {
  mode: Mode;
  product?: Product;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [step, setStep] = useState<"details" | "images">("details");
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);


  const [productId, setProductId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");


  const [uploading, setUploading] = useState(false);
  useEffect(() => {
  if (mode === "edit" && product) {
    setName(product.name);
    setCategory(product.category || "");
    setColor(product.color || "");
    setSize(product.size || "");
    setProductId(product.id);
    setExistingImages(product.image_urls || []);


   
    setStep("details");
  }
}, [mode, product]);


async function saveProduct() {
  if (!name.trim()) {
    alert("Product name is required");
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  // 🔹 CREATE MODE (unchanged logic)
  if (mode === "create") {
    const { data, error } = await supabase
      .from("products")
      .insert({
        seller_id: user.id,
        name,
        category: category || null,
        color: color || null,
        size: size || null,
        status: "draft",
        image_urls: [],
      })
      .select("id")
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setProductId(data.id);
    setStep("images");
    return;
  }

  // 🔹 EDIT MODE (SAFE UPDATE)
  if (mode === "edit" && productId) {
    const { error } = await supabase
      .from("products")
      .update({
        name,
        category: category || null,
        color: color || null,
        size: size || null,
      })
      .eq("id", productId);

    if (error) {
      alert(error.message);
      return;
    }

    onCreated(); // refresh list
    onClose();
  }
}


async function uploadImages() {
  if (!productId) return;

  setUploading(true);

  const uploadedUrls: string[] = [];

  for (const file of newFiles) {
    const fileExt = file.name.split(".").pop();
    const filePath = `${productId}/${crypto.randomUUID()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (error) {
      alert(error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    uploadedUrls.push(data.publicUrl);
  }

  const finalImages = [...existingImages, ...uploadedUrls];

  const { error: updateError } = await supabase
    .from("products")
    .update({ image_urls: finalImages })
    .eq("id", productId);

  setUploading(false);

  if (updateError) {
    alert(updateError.message);
    return;
  }

  onCreated();
  onClose();
}


  
return (
  <div className="min-h-[60vh] flex flex-col">
    {step === "details" && (
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-semibold mb-6">
          Add Product Details
        </h2>

        <div className="space-y-4 flex-1">
          <input
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <input
            placeholder="Color (optional)"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <input
            placeholder="Size (optional)"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>

          {mode === "edit" && (
            <button
              onClick={() => setStep("images")}
              className="px-4 py-2 border rounded"
            >
              Edit Images
            </button>
          )}

          <button
            onClick={saveProduct}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            {mode === "create" ? "Next" : "Save Changes"}
          </button>
        </div>
      </div>
    )}

    {step === "images" && (
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-semibold mb-4">
          {mode === "edit" ? "Edit Images" : "Upload Images"} (up to 5)
        </h2>

        {existingImages.length > 0 && (
          <div className="grid grid-cols-5 gap-3 mb-4">
            {existingImages.map((url) => (
              <div key={url} className="relative">
                <img
                  src={url}
                  className="w-full h-20 object-cover rounded"
                />
                <button
                  onClick={() =>
                    setExistingImages((prev) =>
                      prev.filter((img) => img !== url)
                    )
                  }
                  className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            const remaining = MAX_IMAGES - existingImages.length;

            if (files.length > remaining) {
              alert(`You can upload only ${remaining} more image(s).`);
              return;
            }

            setNewFiles(files);
          }}
        />

        <div className="flex justify-end gap-3 pt-6 mt-auto">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Skip
          </button>

          <button
            onClick={uploadImages}
            disabled={uploading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            {uploading ? "Uploading..." : "Finish"}
          </button>
        </div>
      </div>
    )}
  </div>
);

}
