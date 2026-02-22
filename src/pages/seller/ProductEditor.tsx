import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const MAX_IMAGES = 5;
type Product = Database["public"]["Tables"]["products"]["Row"];
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
      alert("Asset designation required.");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

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

      if (!error) {
        setProductId(data.id);
        setStep("images");
      }
      return;
    }

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

      if (!error) {
        onCreated();
        onClose();
      }
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

      if (!error) {
        const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }
    }

    const finalImages = [...existingImages, ...uploadedUrls];
    const { error: updateError } = await supabase
      .from("products")
      .update({ image_urls: finalImages })
      .eq("id", productId);

    setUploading(false);
    if (!updateError) {
      onCreated();
      onClose();
    }
  }

  return (
    <div className="min-h-[500px] flex flex-col">
      <AnimatePresence mode="wait">
        {step === "details" ? (
          <motion.div
            key="details"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="flex flex-col h-full space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <EditorInput label="Asset Name" value={name} onChange={setName} placeholder="E.G. ARCHITECTURAL OVERCOAT" />
                <EditorInput label="Classification" value={category} onChange={setCategory} placeholder="E.G. OUTERWEAR" />
              </div>
              <div className="space-y-8">
                <EditorInput label="Chromatic Profile" value={color} onChange={setColor} placeholder="E.G. OBSIDIAN / CHARCOAL" />
                <EditorInput label="Dimensional Scale" value={size} onChange={setSize} placeholder="E.G. OVERSIZED L" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-6 pt-12 border-t border-black/5">
              <button
                onClick={onClose}
                className="px-12 py-5 border border-black text-[10px] font-black tracking-[0.4em] uppercase hover:bg-black hover:text-white transition-all"
              >
                Terminate
              </button>

              {mode === "edit" && (
                <button
                  onClick={() => setStep("images")}
                  className="px-12 py-5 border border-black text-[10px] font-black tracking-[0.4em] uppercase hover:bg-black hover:text-white transition-all"
                >
                  Adjust Optical Buffer
                </button>
              )}

              <button
                onClick={saveProduct}
                className="px-12 py-5 bg-black text-white text-[10px] font-black tracking-[0.4em] uppercase hover:bg-black/90 transition-all active:scale-95"
              >
                {mode === "create" ? "Proceed to Optical Data" : "Commit Changes"}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="images"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="flex flex-col h-full space-y-12"
          >
            <div className="space-y-8 font-light text-black/40">
              <p className="text-[10px] font-black tracking-[0.4em] uppercase">Optical Buffer Management</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {/* Existing Images */}
                {existingImages.map((url) => (
                  <div key={url} className="relative aspect-square bg-gray-50 border border-black/5 group">
                    <img
                      src={url}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <button
                      onClick={() => setExistingImages((prev) => prev.filter((img) => img !== url))}
                      className="absolute top-2 right-2 bg-black text-white w-6 h-6 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* Upload Placeholder */}
                {existingImages.length < MAX_IMAGES && (
                  <label className="relative aspect-square border border-dashed border-black/10 flex items-center justify-center cursor-pointer hover:bg-black/5 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const remaining = MAX_IMAGES - existingImages.length;
                        if (files.length > remaining) {
                          alert(`Capacity exceeded. Limit: ${remaining} assets.`);
                          return;
                        }
                        setNewFiles(files);
                      }}
                    />
                    <div className="text-center space-y-2">
                      <Plus className="h-5 w-5 mx-auto text-black/20" />
                      <p className="text-[8px] font-black tracking-widest uppercase text-black/40">Upload</p>
                    </div>
                  </label>
                )}
              </div>
              {newFiles.length > 0 && (
                <p className="text-[10px] font-black tracking-widest uppercase text-black/60">
                  {newFiles.length} New Assets Queued for Deployment
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-6 pt-12 border-t border-black/5 mt-auto">
              <button
                onClick={onClose}
                className="px-12 py-5 border border-black text-[10px] font-black tracking-[0.4em] uppercase hover:bg-black hover:text-white transition-all"
              >
                Skip Deployment
              </button>

              <button
                onClick={uploadImages}
                disabled={uploading}
                className="px-12 py-5 bg-black text-white text-[10px] font-black tracking-[0.4em] uppercase hover:bg-black/90 transition-all"
              >
                {uploading ? "Deploying Assets..." : "Finalize Deployment"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EditorInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black tracking-[0.3em] uppercase text-black/40">{label}</label>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-50 border-none p-6 text-xs font-black tracking-widest uppercase focus:ring-1 focus:ring-black outline-none placeholder:text-black/10"
      />
    </div>
  );
}
