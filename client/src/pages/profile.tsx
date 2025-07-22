import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Eye, RefreshCw, Calendar, Heart, Package } from "lucide-react";
import { getAuth, clearAuth } from "@/lib/auth";
import { User as UserType } from "@/types";

interface QuizHistory {
  id: string;
  profileName: string;
  date: string;
  parfumsCount: number;
  hasOrderedSet: boolean;
}

export default function Profile() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<UserType | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);

  useEffect(() => {
    const currentUser = getAuth();
    if (!currentUser) {
      setLocation("/");
      return;
    }
    setUser(currentUser);

    // Mock quiz history - in production, fetch from backend
    setQuizHistory([
      {
        id: "1",
        profileName: "La Mystique",
        date: "15 janvier 2024",
        parfumsCount: 5,
        hasOrderedSet: true,
      },
      {
        id: "2",
        profileName: "L'Aventurière",
        date: "8 janvier 2024",
        parfumsCount: 5,
        hasOrderedSet: false,
      },
    ]);
  }, [setLocation]);

  const handleLogout = () => {
    clearAuth();
    setLocation("/");
  };

  const handleRetakeQuiz = () => {
    setLocation("/quiz");
  };

  const handleViewResults = (quizId: string) => {
    // In production, fetch specific quiz results
    setLocation("/results");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-cta-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cta-orange to-light-orange rounded-full flex items-center justify-center mb-6 shadow-2xl">
            <User className="text-primary-dark w-10 h-10" />
          </div>
          <h1 className="text-3xl font-serif mb-2">
            {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}
          </h1>
          <p className="text-foreground/60">Membre depuis janvier 2024</p>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-serif text-cta-orange mb-2">{quizHistory.length}</div>
              <div className="text-sm text-foreground/60">Quiz complétés</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-serif text-cta-orange mb-2">
                {quizHistory.reduce((total, quiz) => total + quiz.parfumsCount, 0)}
              </div>
              <div className="text-sm text-foreground/60">Parfums découverts</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-serif text-cta-orange mb-2">
                {quizHistory.filter(quiz => quiz.hasOrderedSet).length}
              </div>
              <div className="text-sm text-foreground/60">Sets commandés</div>
            </CardContent>
          </Card>
        </div>

        {/* Current Profile */}
        {quizHistory.length > 0 && (
          <Card className="bg-card/50 backdrop-blur-sm border-border mb-8">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif mb-6">Votre profil actuel</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-cta-orange to-light-orange rounded-full flex items-center justify-center">
                    <Heart className="text-primary-dark w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-serif mb-2">{quizHistory[0].profileName}</h4>
                    <p className="text-foreground/80">
                      "Elle écoute les silences comme on lit les parfums."
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleViewResults(quizHistory[0].id)}
                  className="border-cta-orange text-cta-orange hover:bg-cta-orange hover:text-primary-dark"
                >
                  Voir les détails
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quiz History */}
        <div className="mb-8">
          <h3 className="text-2xl font-serif mb-6">Historique des quiz</h3>
          
          <div className="space-y-4">
            {quizHistory.map((quiz) => (
              <Card key={quiz.id} className="bg-card/50 backdrop-blur-sm border-border hover:border-cta-orange/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium mb-2">{quiz.profileName}</h4>
                      <p className="text-foreground/60 text-sm mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Complété le {quiz.date}
                      </p>
                      <div className="flex items-center space-x-4">
                        <span className="text-xs bg-cta-orange/20 text-cta-orange px-2 py-1 rounded-full">
                          {quiz.parfumsCount} parfums
                        </span>
                        {quiz.hasOrderedSet && (
                          <span className="text-xs bg-secondary text-foreground/60 px-2 py-1 rounded-full flex items-center">
                            <Package className="w-3 h-3 mr-1" />
                            Set commandé
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewResults(quiz.id)}
                      className="text-cta-orange hover:text-light-orange"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="text-center space-y-4">
          <Button
            onClick={handleRetakeQuiz}
            size="lg"
            className="bg-gradient-to-r from-cta-orange to-light-orange text-primary-dark px-8 py-4 text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <RefreshCw className="mr-2 w-5 h-5" />
            Refaire le quiz
          </Button>
          
          <div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-foreground/60 hover:text-foreground"
            >
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
