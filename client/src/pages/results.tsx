import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Bookmark, ShoppingCart, ExternalLink } from "lucide-react";
import { RadarChart } from "@/components/radar-chart";
import { OlfactoryProfile } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Results() {
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<OlfactoryProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedResult = localStorage.getItem("wolfactiv_quiz_result");
    if (storedResult) {
      try {
        setProfile(JSON.parse(storedResult));
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger vos résultats.",
          variant: "destructive",
        });
        setLocation("/quiz");
      }
    } else {
      setLocation("/quiz");
    }
  }, [setLocation, toast]);

  const handleSaveResults = () => {
    if (!profile) return;
    
    // In a real app, save to backend
    toast({
      title: "Résultats sauvegardés",
      description: "Vos résultats ont été ajoutés à votre profil.",
    });
  };

  const handleOrderSampleSet = () => {
    if (!profile) return;
    
    // Store sample set data for checkout
    localStorage.setItem("wolfactiv_sample_set", JSON.stringify({
      parfums: profile.parfums,
      amount: 1500, // 15€ in cents
    }));
    
    setLocation("/checkout");
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-cta-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Chargement de vos résultats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cta-orange to-light-orange rounded-full flex items-center justify-center mb-6 shadow-2xl">
            <Star className="text-primary-dark w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif mb-4">{profile.profil_nom}</h1>
          <p className="text-xl md:text-2xl text-foreground/80 italic max-w-3xl mx-auto leading-relaxed">
            "{profile.citation}"
          </p>
        </div>

        {/* Radar Chart */}
        <div className="mb-16">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif mb-6 text-center">Votre profil olfactif</h3>
             <RadarChart
              data={{
              labels: profile.radar_data.map((item) => item.label),
              values: profile.radar_data.map((item) => item.value),
              }}
             />


            </CardContent>
          </Card>
        </div>

        {/* Perfume Recommendations */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif text-center mb-12">Vos parfums recommandés</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profile.parfums.map((parfum, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border hover:border-cta-orange/50 transition-all duration-300 group">
                <CardContent className="p-6">
                  <img
                    src={parfum.image || `https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop`}
                    alt={`${parfum.nom} perfume bottle`}
                    className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop";
                    }}
                  />
                  <h4 className="text-xl font-serif mb-2">{parfum.nom}</h4>
                  <p className="text-foreground/60 mb-4">{parfum.marque}</p>
                  {parfum.description && (
                    <p className="text-sm text-foreground/80 mb-6">{parfum.description}</p>
                  )}
                  <Button
                    asChild
                    className="bg-cta-orange hover:bg-light-orange text-primary-dark w-full"
                  >
                    <a
                      href={parfum.lien_achat}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center"
                    >
                      Découvrir chez {parfum.marque}
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sample Set CTA */}
        <div className="text-center mb-12">
          <Card className="bg-gradient-to-r from-cta-orange/10 to-light-orange/10 border-cta-orange/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif mb-4">Testez vos 5 parfums</h3>
              <p className="text-foreground/80 mb-6">
                Recevez un set d'échantillons de vos parfums recommandés pour 15€
              </p>
              <p className="text-sm text-foreground/60 mb-8">
                Le prix du set est remboursé lors de l'achat d'un parfum full size
              </p>
              <Button
                onClick={handleOrderSampleSet}
                size="lg"
                className="bg-gradient-to-r from-cta-orange to-light-orange text-primary-dark px-8 py-4 text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <ShoppingCart className="mr-2 w-5 h-5" />
                Commander le set - 15€
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Save Results CTA */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={handleSaveResults}
            className="text-foreground/60 hover:text-foreground"
          >
            <Bookmark className="mr-2 w-4 h-4" />
            Sauvegarder mes résultats
          </Button>
        </div>
      </div>
    </div>
  );
}
