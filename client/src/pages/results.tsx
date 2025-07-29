import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Bookmark, ShoppingCart, ExternalLink } from "lucide-react";
import { RadarChart } from "@/components/radar-chart";
import { OlfactoryProfile } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { mockProfile } from "@/lib/mockProfile";

export default function Results() {
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<OlfactoryProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Ne pas exécuter si on est en mode test
    if (localStorage.getItem("testMode") === "true") return;

    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast({
          title: "Non connecté",
          description: "Veuillez vous connecter pour voir vos résultats.",
          variant: "destructive",
        });
        setLocation("/quiz");
        return;
      }

      const { data, error } = await supabase
        .from("results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        toast({
          title: "Erreur",
          description: "Aucun résultat trouvé.",
          variant: "destructive",
        });
        setLocation("/quiz");
        return;
      }

      const parsedPerfumes = typeof data.perfumes === "string" ? JSON.parse(data.perfumes) : data.perfumes;
      const parsedRadar = typeof data.radar_data === "string" ? JSON.parse(data.radar_data) : data.radar_data;

      const profileData: OlfactoryProfile = {
        profil_nom: data.character_name,
        citation: data.quote,
        parfums: parsedPerfumes,
        radar_data: parsedRadar,
      };

      setProfile(profileData);
    };

    fetchProfile();

    // Nettoyage : on désactive testMode si on quitte la page
    return () => {
      localStorage.removeItem("testMode");
    };
  }, [setLocation, toast]);

  const handleLoadMock = () => {
    localStorage.setItem("testMode", "true");
    setProfile(mockProfile);
    toast({
      title: "Mode test",
      description: "Résultats fictifs chargés.",
    });
  };

  const handleSaveResults = () => {
    if (!profile) return;
    toast({
      title: "Résultats sauvegardés",
      description: "Vos résultats ont été ajoutés à votre profil.",
    });
  };

  const handleOrderSampleSet = () => {
    if (!profile) return;

    localStorage.setItem("wolfactiv_sample_set", JSON.stringify({
      parfums: profile.parfums,
      amount: 1500,
    }));

    setLocation("/checkout");
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-4">
        <div>
          <div className="animate-spin w-8 h-8 border-4 border-cta-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Chargement de vos résultats...</p>
        </div>

        <button
          onClick={handleLoadMock}
          className="bg-cta-orange hover:bg-light-orange text-primary-dark font-bold py-2 px-4 rounded transition-all duration-300"
        >
          🔓 Tester sans se connecter
        </button>
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
              {profile.radar_data ? (
                <RadarChart
                  data={{
                    labels: Object.keys(profile.radar_data),
                    values: Object.values(profile.radar_data),
                  }}
                />
              ) : (
                <p className="text-center text-sm text-muted">Aucune donnée olfactive disponible.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Perfume Recommendations */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif text-center mb-12">Vos parfums recommandés</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profile.parfums && profile.parfums.length > 0 ? (
              profile.parfums.map((parfum, index) => (
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
                    <a
                      href={parfum.lien_achat}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-cta-orange hover:bg-light-orange text-primary-dark w-full px-4 py-2 rounded font-semibold transition-all duration-300"
                    >
                      Découvrir chez {parfum.marque}
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </a>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted col-span-full">Aucun parfum recommandé pour le moment.</p>
            )}
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
