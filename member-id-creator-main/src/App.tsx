import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { RegistrationFlow } from "./components/registration/RegistrationFlow";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDasboard";
import MemberDashboard from "./pages/member/MemberDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<RegistrationFlow />} />
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
         
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
         
          
            <Route path="/member" element={<ProtectedRoute role="member"><MemberDashboard /></ProtectedRoute>} />
         
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
