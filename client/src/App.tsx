import React, { useEffect } from "react";
import Login from "@/pages/login"; // adapte le chemin
// import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Home from "@/pages/home";
import Quiz from "@/pages/quiz";
import Results from "@/pages/results";
import Profile from "@/pages/profile";
import Contact from "@/pages/contact";
import Checkout from "@/pages/checkout";
import NotFound from "@/pages/not-found";
import { supabase } from "@/lib/supabaseClient"; // ✅ Chemin correct selon ton projet

function Router() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/quiz" component={Quiz} />
          <Route path="/results" component={Results} />
          <Route path="/profile" component={Profile} />
          <Route path="/contact" component={Contact} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/login" component={Login} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  useEffect(() => {
    const testFetch = async () => {
      const { data, error } = await supabase.from("results").select("*");
      if (error) {
        console.error("Erreur Supabase :", error);
      } else {
        console.log("Results trouvés :", data);
      }
    };

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log("Session actuelle :", data?.session);
    };

  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
