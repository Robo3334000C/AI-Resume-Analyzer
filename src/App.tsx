import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./components/theme-provider";
import SmoothScroll from "./components/SmoothScroll";

const Index = React.lazy(() => import("./pages/Index"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Upload = React.lazy(() => import("./pages/Upload"));
const Result = React.lazy(() => import("./pages/Result"));

// Old remaining routes temporarily intact for other tools
const ProficiencyAnalyzer = React.lazy(() => import("./pages/ProficiencyAnalyzer"));
const InterviewSimulator = React.lazy(() => import("./pages/InterviewSimulator"));
const MaterialLanding = React.lazy(() => import("./pages/MaterialLanding"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FFFBF8]">
    <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/auth" element={<Auth />} />

          {/* Protected Routes Wrapper */}
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          <Route path="/result/:id" element={<ProtectedRoute><Result /></ProtectedRoute>} />

          <Route path="/proficiency-analyzer" element={<ProficiencyAnalyzer />} />
          <Route path="/interview-simulator" element={<InterviewSimulator />} />
          <Route path="/m3-landing" element={<MaterialLanding />} />
          <Route path="/m3-landing/*" element={<MaterialLanding />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SmoothScroll>
          <AnimatedRoutes />
        </SmoothScroll>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
