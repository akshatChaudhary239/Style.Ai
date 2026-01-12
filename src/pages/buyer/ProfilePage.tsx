import { motion } from "framer-motion";
import { ProfileForm } from "@/components/ProfileForm";

export default function ProfilePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="
        w-full
        flex
        justify-center
        px-3 sm:px-4
        py-2
      "
    >
      {/* Profile Form is the STAR */}
      <ProfileForm />
    </motion.div>
  );
}
