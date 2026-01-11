import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { NavigationProgress } from "./components/NavigationProgress";

const queryClient = new QueryClient();

// Set dark mode by default (GitHub Dark Dimmed)
const ThemeInitializer = () => {
  useEffect(() => {
    // Always start with dark theme
    document.documentElement.classList.add("dark");
  }, []);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeInitializer />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavigationProgress />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/repo/:repoName" element={<Index />} />
          <Route path="/repo/:repoName/*" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
