import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ParkingProvider } from "@/contexts/ParkingContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import AddVehicle from "./pages/AddVehicle";
import SmartScan from "./pages/SmartScan";
import FindParking from "./pages/FindParking";
import AdvancedSearch from "./pages/AdvancedSearch";
import SlotSelection from "./pages/SlotSelection";
import ActiveParking from "./pages/ActiveParking";
import DriverAuth from "./pages/driver/Auth";
import DriverDashboard from "./pages/driver/DriverDashboard";
import Bill from "./pages/Bill";
import History from "./pages/History";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Profile from "./pages/settings/Profile";
import Notifications from "./pages/settings/Notifications";
import Support from "./pages/settings/Support";
import Wallet from "./pages/Wallet";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageSpots from "./pages/admin/ManageSpots";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminAuth from "./pages/admin/AdminAuth";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import { AIChatbot } from "@/components/ai/AIChatbot";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ParkingProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/driver/auth" element={<DriverAuth />} />
            <Route path="/driver/dashboard" element={<DriverDashboard />} />
            <Route path="/admin/login" element={<AdminAuth />} />

            {/* Protected Routes */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/find-parking" element={<ProtectedRoute><FindParking /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><AdvancedSearch /></ProtectedRoute>} />
            <Route path="/smart-scan" element={<ProtectedRoute><SmartScan /></ProtectedRoute>} />
            <Route path="/add-vehicle" element={<ProtectedRoute><AddVehicle /></ProtectedRoute>} />
            <Route path="/slots" element={<ProtectedRoute><SlotSelection /></ProtectedRoute>} />
            <Route path="/parking" element={<ProtectedRoute><ActiveParking /></ProtectedRoute>} />
            <Route path="/bill" element={<ProtectedRoute><Bill /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/settings/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/settings/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
            <Route path="/super-admin" element={<AdminProtectedRoute requireSuperAdmin><SuperAdminDashboard /></AdminProtectedRoute>} />
            <Route path="/admin/spots" element={<AdminProtectedRoute><ManageSpots /></AdminProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIChatbot />
        </BrowserRouter>
      </ParkingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
