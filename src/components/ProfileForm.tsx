import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  type BodyType,
  type SkinTone,
  type ProfileInput,
  type UserProfile,
  getProfileByUserId,
  saveOrUpdateProfile,
} from "@/lib/profile-api";
import { Loader2, RefreshCw, Sparkles, User, LogOut } from "lucide-react";

const BODY_TYPES: { value: BodyType; label: string }[] = [
  { value: "skinny", label: "Skinny" },
  { value: "fat", label: "Fat" },
  { value: "skinny fat", label: "Skinny Fat" },
  { value: "extreme fat", label: "Extreme Fat" },
];

const SKIN_TONES: { value: SkinTone; label: string }[] = [
  { value: "white", label: "White" },
  { value: "brown", label: "Brown" },
  { value: "black", label: "Black" },
  { value: "asian", label: "Asian" },
];

export function ProfileForm() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [existingProfile, setExistingProfile] = useState<UserProfile | null>(null);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [bodyType, setBodyType] = useState<BodyType | "">("");
  const [skinTone, setSkinTone] = useState<SkinTone | "">("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadExistingProfile();
    }
  }, [user]);

  async function loadExistingProfile() {
    if (!user) return;
    setIsLoading(true);
    try {
      const profile = await getProfileByUserId(user.id);
      if (profile) {
        setExistingProfile(profile);
        setHeightCm(profile.height_cm.toString());
        setWeightKg(profile.weight_kg.toString());
        setBodyType(profile.body_type);
        setSkinTone(profile.skin_tone);
        setShowUpdatePrompt(true);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function validateInput(): ProfileInput | null {
    const height = parseInt(heightCm);
    const weight = parseInt(weightKg);

    if (isNaN(height) || height < 30 || height > 300) {
      toast({
        title: "Invalid Height",
        description: "Height must be between 30 and 300 cm",
        variant: "destructive",
      });
      return null;
    }

    if (isNaN(weight) || weight < 2 || weight > 500) {
      toast({
        title: "Invalid Weight",
        description: "Weight must be between 2 and 500 kg",
        variant: "destructive",
      });
      return null;
    }

    if (!bodyType) {
      toast({
        title: "Body Type Required",
        description: "Please select your body type",
        variant: "destructive",
      });
      return null;
    }

    if (!skinTone) {
      toast({
        title: "Skin Tone Required",
        description: "Please select your skin tone",
        variant: "destructive",
      });
      return null;
    }

    return {
      height_cm: height,
      weight_kg: weight,
      body_type: bodyType,
      skin_tone: skinTone,
    };
  }

  async function handleSave() {
    if (!user) return;
    
    const input = validateInput();
    if (!input) return;

    setIsSaving(true);
    try {
      const result = await saveOrUpdateProfile(user.id, input);
      
      setExistingProfile(result.profile);
      setShowUpdatePrompt(true);

      toast({
        title: result.isNew ? "Profile Created ✔" : "Profile Updated ✔",
        description: result.isNew 
          ? "Your style & fit profile has been saved!" 
          : "Your changes have been saved!",
      });

    // Call your custom backend AI engine
    const selectedClothingType = "casual";
    const selectedBudget = "1000-2000";

    const aiResponse = await fetch("http://localhost:8000/ai/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        height_cm: input.height_cm,
        weight_kg: input.weight_kg,
        body_type: input.body_type,
        skin_tone: input.skin_tone,
        clothing_type: selectedClothingType,
        budget: selectedBudget,
      }),
    });

    const aiData = await aiResponse.json();
    navigate("/recommendation", { 
  state: aiData.recommendation 
    });

    // (Optional)
    // Show a toast with AI confirmation
    toast({
      title: "AI Processing Complete",
      description: "Your style recommendations are being prepared!",
    });


    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate("/auth", { replace: true });
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

return (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="w-full max-w-lg mx-auto px-3 sm:px-0"
  >
    {/* Top Actions */}


    {/* Existing profile hint */}
    {showUpdatePrompt && existingProfile && (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="mb-6 border-primary/20 bg-primary/5 shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6 }}
                className="p-2 rounded-full bg-primary/10"
              >
                <RefreshCw className="h-5 w-5 text-primary" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Profile detected
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Update your body details to keep recommendations accurate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )}

    {/* Main Card */}
    <motion.div
      layout
      className="bg-white rounded-3xl shadow-xl border border-border/50"
    >
      <CardHeader className="text-center pb-2">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mb-4 p-4 rounded-2xl gradient-hero w-fit shadow-glow"
        >
          <User className="h-8 w-8 text-primary-foreground" />
        </motion.div>

        <CardTitle className="text-2xl">
          Style & Fit Profile
        </CardTitle>
        <CardDescription>
          These inputs directly affect Style.AI’s recommendations
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
        {/* Section: Measurements */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-4"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Body Measurements
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Height */}
            <div className="space-y-2">
              <Label>Height (cm)</Label>
              <Input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="h-12 focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="h-12 focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </motion.div>

        {/* Section: Body Type */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-2"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Body Structure
          </h3>

          <Select value={bodyType} onValueChange={(v) => setBodyType(v as BodyType)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select body type" />
            </SelectTrigger>
            <SelectContent>
              {BODY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Section: Skin Tone */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="space-y-2"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Appearance
          </h3>

          <Select value={skinTone} onValueChange={(v) => setSkinTone(v as SkinTone)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select skin tone" />
            </SelectTrigger>
            <SelectContent>
              {SKIN_TONES.map((tone) => (
                <SelectItem key={tone.value} value={tone.value}>
                  {tone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-4"
        >
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
            variant="hero"
            className="w-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Updating Style.AI…
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Update Style Profile
              </>
            )}
          </Button>

          {existingProfile && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Last updated:{" "}
              {new Date(existingProfile.updated_at).toLocaleDateString()}
            </p>
          )}
        </motion.div>
      </CardContent>
    </motion.div>

    <p className="text-xs text-center text-muted-foreground mt-6 px-4">
      This is not a medical tool. Data is used only for personalized styling.
    </p>
  </motion.div>
)};