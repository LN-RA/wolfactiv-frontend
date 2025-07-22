import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background opacity-90"></div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        {/* Wolf mascot */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cta-orange to-light-orange rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-primary-dark text-3xl font-bold">🐺</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
          Découvrez votre
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cta-orange to-light-orange block">
            signature olfactive
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed">
          Révélez votre personnalité à travers les parfums. Un voyage sensoriel unique vous attend.
        </p>
        
        <Link href="/quiz">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-cta-orange to-light-orange text-primary-dark px-12 py-6 text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Commencer le quiz
            <ArrowRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
        
        <div className="mt-16 text-foreground/60 text-sm flex items-center justify-center space-x-4">
          <Sparkles className="w-4 h-4" />
          <span>2 minutes • Résultats personnalisés • Parfums de niche</span>
        </div>
      </div>
    </div>
  );
}
