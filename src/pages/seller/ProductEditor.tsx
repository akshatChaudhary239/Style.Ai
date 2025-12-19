import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const MAX_IMAGES = 5;

export default function ProductEditor({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [step, setStep] = useState<"details" | "images">("details");

  const [productId, setProductId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  async function createProduct() {
    if (!name.trim()) {
      alert("Product name is required");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

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
  }

  async function uploadImages() {
    if (!productId) return;
    if (files.length === 0) {
      onCreated();
      onClose();
      return;
    }

    if (files.length > MAX_IMAGES) {
      alert("Maximum 5 images allowed");
      return;
    }

    setUploading(true);

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const filePath = `${productId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) {
        alert(uploadError.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);
    }

    const { error: updateError } = await supabase
      .from("products")
      .update({ image_urls: uploadedUrls })
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
    <div>
      {step === "details" && (
        <>
          <h2 className="text-xl font-semibold mb-6">
            Add Product Details
          </h2>

          <div className="space-y-4">
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

            <div className="flex justify-end gap-3 pt-4">
              <button onClick={onClose} className="px-4 py-2 border rounded">
                Cancel
              </button>

              <button
                onClick={createProduct}
                className="px-4 py-2 bg-primary text-primary-foreground rounded"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {step === "images" && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Upload Images (up to 5)
          </h2>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setFiles(Array.from(e.target.files || []))
            }
          />

          <div className="flex justify-end gap-3 pt-6">
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
        </>
      )}
    </div>
  );
}
