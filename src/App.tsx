import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
// import Recommendation from "../src/pages/Recommendations";
import BecomeSeller from "./pages/BecomeSeller";
import ChooseRole from "./pages/ChooseRole";

import SellerDashboard from "./pages/seller/SellerDashboard";
import HomeGate from "./pages/HomeGate";
import BuyerDashboard from "./pages/buyer/Dashboard";
import BuyerLayout from "@/pages/buyer/Dashboard";
import BuyerHome from "@/pages/buyer/Buyerhome";
import Recommendations from "@/pages/buyer/Recommendations";
import LikedClothes from "./pages/buyer/LikedClothes";
import HelpSupport from "./pages/buyer/HelpSupport";
import ProfilePage from "./pages/buyer/ProfilePage";
import SellerHelpSupport from "./pages/seller/SellerHelpSupport";
import SellerLayout from "./pages/seller/SellerLayout";
import SellerProducts from "./pages/seller/SellerProducts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Index/>} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/app" element={<HomeGate />} />

    <Route path="/index" element={<Index />} />
    {/* <Route path="/seller/SellerDashboard" element={<SellerDashboard />} /> */}
    {/* <Route path="/seller/SellerHelpSupport" element={<SellerHelpSupport />} /> */}
    <Route path="/become-seller" element={<BecomeSeller />} />
    <Route path="/choose-role" element={<ChooseRole />} />

    {/* BUYER ROUTES*/}
   <Route path="/buyer" element={<BuyerDashboard />}>
  <Route index element={<BuyerHome />} />
  <Route path="recommendations" element={<Recommendations />} />
  <Route path="liked" element={<LikedClothes />} /> 
  <Route path="help" element={<HelpSupport />} /> 
  <Route path="Profile" element={<ProfilePage/>} /> 
</Route>


{/* Seller routes */}
<Route path="/seller" element={<SellerLayout />}>
  <Route index element={<SellerDashboard />} />
  <Route path="dashboard" element={<SellerDashboard />} />
  <Route path="products" element={<SellerProducts />} />
  <Route path="help" element={<SellerHelpSupport />} />
</Route>



    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>

      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
