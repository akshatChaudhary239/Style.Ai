import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Recommendation from "../src/pages/Recommendations";
import BecomeSeller from "./pages/BecomeSeller";
import ChooseRole from "./pages/ChooseRole";
import RoleGate from "./pages/RoleGate";
import SellerDashboard from "./pages/seller/SellerDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<RoleGate />} />
            <Route path="/index" element={<Index />} />
            <Route path="/seller/SellerDashboard" element={<SellerDashboard />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="/become-seller" element={<BecomeSeller />} />
            <Route path="/choose-role" element={<ChooseRole />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
