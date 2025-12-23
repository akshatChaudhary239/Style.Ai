import AppNavbar from "@/components/AppNavbar";
import { Outlet } from "react-router-dom";

export default function BuyerDashboard() {
  return (
    <>
    <AppNavbar/>
    <Outlet/>
    <div className="p-6">
      <h1 className="text-xl font-bold">Buyer Dashboard</h1>
      <p className="mt-2 text-gray-500">
        Buyer mode coming soon.
      </p>
    </div>
    </>
  );
}
