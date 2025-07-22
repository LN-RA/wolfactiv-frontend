import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, SkipForward } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitQuiz } from "@/lib/api";
import { QuizQuestion, QuizAnswers } from "@/types";

const quizQuestions: QuizQuestion[] = [
  {
    id: "goûts_1",
    type: "multiple_choice",
    question: "Bonjour ! Je suis ravi de vous accompagner dans cette découverte olfactive. Pour commencer, parlez-moi de vos goûts culinaires préférés.",
    options: [
      "Sucré (chocolat, vanille, miel)",
      "Épicé (poivre, cannelle, gingembre)",
      "Frais (citron, menthe, concombre)",
      "Boisé (noix, cèdre, santal)"
    ]
  },
  {
    id: "goûts_2",
    type: "multiple_choice",
    question: "Quand vous choisissez une boisson, vers quoi vous tournez-vous naturellement ?",
    options: [
      "Thé aux épices ou café noir",
      "Jus de fruits frais ou eau pétillante",
      "Vin rouge ou whisky",
      "Tisanes florales ou cocktails fruités"
    ]
  },
  {
    id: "saisons",
    type: "multiple_choice",
    question: "Quelle saison vous inspire le plus ?",
    options: [
      "Printemps - renaissance et fraîcheur",
      "Été - chaleur et liberté",
      "Automne - mystère et profondeur",
      "Hiver - cocooning et réconfort"
    ]
  },
  {
    id: "moments",
    type: "multiple_choice",
    question: "À quel moment de la journée vous sentez-vous le plus vous-même ?",
    options: [
      "Tôt le matin, dans le calme de l'aube",
      "En plein jour, dans l'action",
      "En fin d'après-midi, moment de transition",
      "Le soir, dans l'intimité"
    ]
  },
  {
    id: "lieux",
    type: "multiple_choice",
    question: "Quel lieu vous attire le plus ?",
    options: [
      "Une bibliothèque ancienne aux murs de bois",
      "Un jardin de roses en fleurs",
      "Une plage au coucher du soleil",
      "Un marché aux épices oriental"
    ]
  },
  {
    id: "personnalité",
    type: "text",
    question: "Pour finir, décrivez-vous en quelques mots. Qu'est-ce qui vous rend unique ? Quelles sont vos valeurs les plus importantes ?",
  }
];

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    goûts: [],
    questions_psy: ""
  });
  const [textAnswer, setTextAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  const handleMultipleChoiceAnswer = (answer: string) => {
    if (currentQuestion.id.startsWith("goûts")) {
      setAnswers(prev => ({
        ...prev,
        goûts: [...prev.goûts, answer]
      }));
    }
    
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleTextAnswer = () => {
    if (!textAnswer.trim()) {
      toast({
        title: "Réponse requise",
        description: "Veuillez saisir votre réponse avant de continuer.",
        variant: "destructive",
      });
      return;
    }

    setAnswers(prev => ({
      ...prev,
      questions_psy: textAnswer
    }));

    handleQuizSubmit();
  };

  const handleQuizSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const finalAnswers = {
        ...answers,
        questions_psy: textAnswer || answers.questions_psy
      };

      const result = await submitQuiz(finalAnswers);
      
      // Store result in localStorage for results page
      localStorage.setItem("wolfactiv_quiz_result", JSON.stringify(result));
      
      setLocation("/results");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de soumettre le quiz. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-foreground/60">
              Question {currentQuestionIndex + 1} sur {quizQuestions.length}
            </span>
            <span className="text-sm text-foreground/60">
              {Math.round(progress)}% complété
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Quiz Interface */}
        <div className="bg-card/50 rounded-3xl p-8 backdrop-blur-sm border border-border">
          {/* Wolf Avatar */}
          <div className="flex items-start space-x-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-cta-orange to-light-orange rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-dark text-lg font-bold">🐺</span>
            </div>
            <div className="flex-1">
              <div className="bg-secondary rounded-2xl rounded-tl-sm p-6 mb-4">
                <p className="text-lg leading-relaxed">{currentQuestion.question}</p>
              </div>
            </div>
          </div>

          {/* Answer Options */}
          {currentQuestion.type === "multiple_choice" && currentQuestion.options && (
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left p-4 h-auto justify-between bg-secondary/50 hover:bg-cta-orange/20 hover:border-cta-orange border-border transition-all duration-200 group"
                  onClick={() => handleMultipleChoiceAnswer(option)}
                  disabled={isSubmitting}
                >
                  <span className="text-foreground">{option}</span>
                  <ChevronRight className="w-4 h-4 text-foreground/40 group-hover:text-cta-orange transition-colors" />
                </Button>
              ))}
            </div>
          )}

          {/* Text Input */}
          {currentQuestion.type === "text" && (
            <div className="space-y-4 mb-8">
              <label className="block text-foreground/80 text-sm font-medium">
                Votre réponse :
              </label>
              <Textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Décrivez-vous en quelques mots..."
                className="min-h-[120px] bg-secondary border-border focus:border-cta-orange"
                disabled={isSubmitting}
              />
              <Button
                onClick={handleTextAnswer}
                className="bg-cta-orange hover:bg-light-orange text-primary-dark"
                disabled={isSubmitting || !textAnswer.trim()}
              >
                {isSubmitting ? "Analyse en cours..." : "Terminer le quiz"}
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0 || isSubmitting}
              className="text-foreground/60 hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>
            
            {currentQuestion.type === "multiple_choice" && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                disabled={isSubmitting}
                className="text-foreground/60 hover:text-foreground"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Passer
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
