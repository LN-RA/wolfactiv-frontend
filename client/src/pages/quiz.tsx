import { famillesDescripteurs } from "@/data/familles_olfactives";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, SkipForward } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { getAuth } from "@/lib/auth";
import { quizQuestions } from "./quizQuestions";
import { QuizAnswers } from "@/types";


export default function Quiz() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const userFromStorage = getAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswers>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    submittedAt: new Date().toISOString(),
    hasStrongMemory: false,
    strongMemoryOdor: "",
    personalityAnswers: {},
    dislikedOdors: [],
    happyMemoryOdor: "",
    finalComment: ""
  });
 const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  const storedUser = getAuth();
  if (!storedUser) {
    setLocation("/login");
  } else {
    setUser(storedUser);
  }
}, []);


  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  const handleAnswer = async (answer: string | string[]) => {
    const question = currentQuestion;
    switch (question.id) {
      case "memoryOdor":
        setAnswers((prev) => ({
          ...prev,
          strongMemoryOdor: Array.isArray(answer) ? answer.join(", ") : answer
        }));
        break;
      case "dislikedOdors":
        setAnswers((prev) => ({ ...prev, dislikedOdors: Array.isArray(answer) ? answer : [] }));
        break;
      case "happyMemory":
        setAnswers((prev) => ({
          ...prev,
          happyMemoryOdor: Array.isArray(answer) ? answer.join(", ") : answer
        }));
        break;
      case "firstName":
        setAnswers((prev) => ({ ...prev, firstName: answer as string }));
        break;
      case "lastName":
        setAnswers((prev) => ({ ...prev, lastName: answer as string }));
        break;
      case "email":
        setAnswers((prev) => ({ ...prev, email: answer as string }));
        break;
      case "phone":
        setAnswers((prev) => ({ ...prev, phone: answer as string }));
        break;
      case "strongMemory":
        setAnswers((prev) => ({ ...prev, hasStrongMemory: answer === "Oui, absolument" }));
        break;
      case "feedback":
        setAnswers((prev) => ({ ...prev, finalComment: answer as string }));
        break;
      default:
        if (question.category === "personality") {
          setAnswers((prev) => ({
            ...prev,
            personalityAnswers: {
              ...prev.personalityAnswers,
              [question.id]: answer as string
            }
          }));
        }
        break;
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentAnswer("");
      setSelectedOptions([]);
    } else {
      await handleQuizSubmit();
    }
  };

const handleQuizSubmit = async () => {
  setIsSubmitting(true);

  // 🔐 Vérifie que l'utilisateur est connecté
  if (!user || !user.id) {
    toast({
      title: "Non connecté",
      description: "Veuillez vous connecter pour voir vos résultats.",
      variant: "destructive",
    });
    setIsSubmitting(false);
    return;
  }

  try {
    // 📝 Prépare les données à enregistrer dans Supabase
    const dataToInsert = {
      user_id: user.id,
      first_name: answers.firstName,
      last_name: answers.lastName,
      email: answers.email,
      phone: answers.phone,
      submitted_at: new Date().toISOString(),
      personality_answers: answers.personalityAnswers,
      disliked_odors: answers.dislikedOdors,
      happy_memory_odor: answers.happyMemoryOdor,
      happy_memory_adjectives: answers.happyMemoryAdjectives,
      strong_memory_odor: answers.strongMemoryOdor,
      has_strong_memory: answers.hasStrongMemory,
      final_comment: answers.finalComment,
    };

    // ✅ Envoie à Supabase
    const { error } = await supabase.from("quiz_results").insert([dataToInsert]);
    if (error) throw error;

    // 🚀 Envoie au backend FastAPI
    const response = await fetch("http://127.0.0.1:8000/submit_quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    });
    if (!response.ok) throw new Error("Erreur depuis FastAPI");

    const result = await response.json();

    // 💾 Stocke en local
    localStorage.setItem("wolfactiv_quiz_result", JSON.stringify(result));

    // 🧭 Redirection vers résultats
    setLocation("/results");
  } catch (err) {
    console.error("Erreur handleQuizSubmit:", err);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de l’envoi du quiz.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};


  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentAnswer("");
      setSelectedOptions([]);
    } else {
      handleQuizSubmit();
    }
  };

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

const renderQuestionContent = () => {
  const question = currentQuestion;

  if (["dislikedOdors", "happyMemory", "memoryOdor"].includes(question.id)) {
  const familleKeyMap: { [key: string]: string } = {
    dislikedOdors: "Florale",
    happyMemory: "Boisée",
    memoryOdor: "Épicée",
  };

  const familleKey = familleKeyMap[question.id];
  const descripteurs = famillesDescripteurs[familleKey] || [];

    return (
      <div className="grid grid-cols-2 gap-2">
        {descripteurs.map((desc) => (
          <Button
            key={desc}
            variant={selectedOptions.includes(desc) ? "default" : "outline"}
            onClick={() => toggleOption(desc)}
          >
            {desc}
          </Button>
        ))}
        <Button
          className="col-span-2 mt-4"
          onClick={() => handleAnswer(selectedOptions)}
        >
          Valider mes choix
        </Button>
      </div>
    );
  }

    switch (question.type) {
     case "contact":
  return (
    <Input
      placeholder={question.question}
      value={answers[question.id as keyof QuizAnswers] as string || ""}
      onChange={(e) => {
        const value = e.target.value;
        setAnswers((prev) => ({
          ...prev,
          [question.id]: value,
        }));
        setCurrentAnswer(value); // <- indispensable pour activer le bouton
      }}
    />
  );


      case "multiple_choice":
        return (
          <div className="space-y-2">
            {question.options.map((option) => (
              <Button
                key={option}
                variant={selectedOptions.includes(option) ? "default" : "outline"}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        );
      case "image_selection":
        return (
          <div className="grid grid-cols-2 gap-2">
            {question.options.map((option) => (
              <Button
                key={option}
                variant={selectedOptions.includes(option) ? "default" : "outline"}
                onClick={() => toggleOption(option)}
              >
                {option}
              </Button>
            ))}
            <Button
              className="col-span-2 mt-4"
              onClick={() => handleAnswer(selectedOptions)}
            >
              Valider mes choix
            </Button>
          </div>
        );
      case "text":
        return (
          <Textarea
            placeholder="Partage ton avis ici !"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            onBlur={() => handleAnswer(currentAnswer)}
          />
        );
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20 text-xl text-foreground/70">
        Veuillez vous connecter pour accéder au test olfactif.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-secondary to-cream py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-foreground/60 font-medium">
              Question {currentQuestionIndex + 1} sur {quizQuestions.length}
            </span>
            <span className="text-sm text-foreground/60 font-medium">
              {Math.round(progress)}% complété
            </span>
          </div>
          <Progress value={progress} className="h-3 rounded-full" />
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-start space-x-6 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cta-orange to-light-orange rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white text-2xl">🐺</span>
              </div>
              <div className="flex-1">
                <div className="bg-secondary/50 rounded-3xl rounded-tl-sm p-6 shadow-sm">
                  <p className="text-xl leading-relaxed text-foreground">
                    {currentQuestion.question}
                  </p>
                </div>
              </div>
            </div>

            {renderQuestionContent()}

            <div className="flex justify-between items-center pt-6">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0 || isSubmitting}
                className="text-foreground/60 hover:text-foreground hover:bg-secondary rounded-2xl px-6"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>

              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  disabled={isSubmitting}
                  className="text-foreground/60 hover:text-foreground hover:bg-secondary rounded-2xl px-6"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Passer
                </Button>

                <Button
                  onClick={() => handleAnswer(currentAnswer)}
                  disabled={
                    isSubmitting ||
                    (["firstName", "lastName", "email"].includes(currentQuestion.id) && !currentAnswer.trim()) ||
                    (currentQuestion.category === "personality" && !currentAnswer)
                  }
                  className="bg-cta-orange hover:bg-light-orange text-white rounded-2xl px-6"
                >
                  {currentQuestionIndex === quizQuestions.length - 1 ? "Envoyer" : "Suivant"}
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
