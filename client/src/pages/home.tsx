import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-background to-secondary opacity-95"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(232,159,113,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(239,189,158,0.08),transparent_50%)]"></div>
      
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
        {/* Wolf mascot */}
        <div className="mb-12 animate-pulse">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cta-orange to-light-orange rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300">
            <span className="text-white text-4xl">🐺</span>
          </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-tight text-primary-dark">
          Découvrez votre
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cta-orange via-light-orange to-cta-orange block mt-2">
            signature olfactive
          </span>
        </h1>
        
        <p className="text-2xl md:text-3xl text-foreground/70 mb-16 max-w-3xl mx-auto leading-relaxed font-light">
          Révélez votre essence profonde à travers les parfums. 
          <br className="hidden md:block" />
          Un voyage sensoriel personnalisé vous attend.
        </p>
        
        <Link href="/quiz">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-cta-orange to-light-orange text-white px-16 py-8 text-xl font-semibold hover:shadow-2xl hover:scale-110 transition-all duration-300 rounded-3xl shadow-lg"
          >
            Commencer mon quiz
            <ArrowRight className="ml-4 w-6 h-6" />
          </Button>
        </Link>
        
        <div className="mt-20 text-foreground/50 text-lg flex items-center justify-center space-x-6 bg-card/50 backdrop-blur-sm px-8 py-4 rounded-full border border-border shadow-sm">
          <Sparkles className="w-5 h-5 text-cta-orange" />
          <span>5 minutes • Résultats personnalisés • Parfums de niche</span>
          <Sparkles className="w-5 h-5 text-light-orange" />
        </div>
      </div>
    </div>
  );
}
