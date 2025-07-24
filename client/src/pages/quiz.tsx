// ./quiz.tsx

import { famillesDescripteurs } from "@/data/familles_olfactives";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, SkipForward } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { QuizQuestion, QuizAnswers } from "@/types";
import { famillesDescripteurs as famillesOlfactives } from "@/data/familles_olfactives";

// ⬇️ Ici tu remets ton tableau quizQuestions (inchangé) ⬇️
const quizQuestions: QuizQuestion[] = [
  // Contact
  {
    id: "firstName",
    type: "contact",
    category: "contact",
    question: "Bonjour ! Je suis ravi de vous accompagner dans cette découverte olfactive. Commençons par faire connaissance. Quel est votre prénom ?"
  },
  {
    id: "lastName",
    type: "contact", 
    category: "contact",
    question: "Et votre nom de famille ?"
  },
  {
    id: "email",
    type: "contact",
    category: "contact", 
    question: "Votre adresse e-mail pour recevoir vos résultats ?"
  },
  {
    id: "phone",
    type: "contact",
    category: "contact",
    question: "Votre numéro de téléphone (optionnel) ?"
  },

  // Memory
  {
    id: "strongMemory",
    type: "multiple_choice",
    category: "memory",
    question: "Avez-vous un souvenir fort lié à une odeur ?",
    options: ["Oui, absolument", "Peut-être", "Non, pas vraiment"]
  },
  {
    id: "memoryOdor",
    type: "image_selection", // <-- correction ici
    category: "memory", 
    question: "Quelle est cette odeur qui vous marque ? Décrivez-la ou choisissez parmi les suggestions.",
    options: []
  },

  // Personality
  {
    id: "perception",
    type: "multiple_choice",
    category: "personality",
    question: "Dans une situation idéale, comment aimeriez-vous qu'on vous perçoive sans parler ?",
    options: ["Mystérieux et intriguant", "Chaleureux et bienveillant", "Élégant et sophistiqué", "Authentique et naturel"]
  },
  {
    id: "pride",
    type: "multiple_choice", 
    category: "personality",
    question: "Quand vous êtes seul·e, qu'est-ce qui vous rend le plus fier·e ou puissant·e intérieurement ?",
    options: ["Ma capacité à comprendre les autres", "Mon indépendance et ma force", "Ma créativité et mon originalité", "Ma loyauté et ma constance"]
  },
  {
    id: "challenge",
    type: "multiple_choice",
    category: "personality", 
    question: "Face à un défi, quelle posture intérieure aimeriez-vous adopter instinctivement ?",
    options: ["Analyser calmement la situation", "Foncer avec détermination", "Chercher une approche créative", "M'appuyer sur mon expérience"]
  },
  {
    id: "presence",
    type: "multiple_choice",
    category: "personality",
    question: "Dans une pièce pleine de monde, que souhaiteriez-vous émaner sans vous mettre en avant ?",
    options: ["Une aura de sagesse tranquille", "Une énergie positive contagieuse", "Une élégance naturelle", "Une profondeur mystérieuse"]
  },
  {
    id: "mastery",
    type: "multiple_choice",
    category: "personality",
    question: "Quel est pour vous le plus grand signe de maîtrise de soi ou de charisme ?",
    options: ["Rester calme dans toutes les situations", "Inspirer confiance naturellement", "Exprimer sa personnalité sans artifice", "Savoir écouter vraiment les autres"]
  },
  {
    id: "essence",
    type: "multiple_choice",
    category: "personality", 
    question: "Si vous deviez incarner un parfum, mais sans mot, juste une sensation intérieure, quelle serait-elle ?",
    options: ["Une brise fraîche qui apaise", "Un feu doux qui réchauffe", "Un mystère qui intrigue", "Une évidence qui rassure"]
  },
  {
    id: "love",
    type: "multiple_choice",
    category: "personality",
    question: "Qu'attendez-vous le plus d'une relation amoureuse idéale ?",
    options: ["Une complicité intellectuelle profonde", "Une passion intense et sincère", "Une harmonie parfaite au quotidien", "Une liberté partagée et respectée"]
  },
  {
    id: "dream",
    type: "text",
    category: "personality",
    question: "Quel rêve d'enfance conservez-vous dans un coin de votre esprit ?"
  },
  {
    id: "worstRemark",
    type: "multiple_choice",
    category: "personality",
    question: "Quelle est la pire remarque que l'on puisse vous faire ?",
    options: ["Que vous êtes superficiel·le", "Que vous êtes prévisible", "Que vous êtes insensible", "Que vous manquez d'authenticité"]
  },
  {
    id: "trace",
    type: "multiple_choice",
    category: "personality",
    question: "Si vous pouviez laisser une trace invisible derrière vous, que souhaiteriez-vous qu'on ressente ?",
    options: ["Un sentiment de sérénité", "Une énergie inspirante", "Un parfum de mystère", "Une impression de vérité"]
  },
  {
    id: "despised",
    type: "multiple_choice", 
    category: "personality",
    question: "Quel trait de caractère méprisez-vous le plus chez les autres ?",
    options: ["La superficialité", "La malhonnêteté", "La fermeture d'esprit", "L'indifférence aux autres"]
  },

  // Sensory
  {
    id: "dislikedOdors",
    type: "image_selection",
    category: "sensory",
    question: "Quelles sont les odeurs que vous détestez ? (Sélectionnez toutes celles qui vous dérangent)",
    options: []
  },
  {
    id: "happyMemory",
    type: "image_selection",
    category: "sensory", 
    question: "Quelle odeur vous rappelle un moment heureux ?",
    options: []
  },

  // Feedback
  {
    id: "feedback",
    type: "text",
    category: "feedback",
    question: "Comment améliorer l'expérience ? Qu'avez-vous aimé ? Ce qui vous passe par la tête 😉"
  }
];

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    submittedAt: new Date().toISOString(),
    hasStrongMemory: false,
    strongMemoryOdor: "",
    personalityAnswers: [],
    dislikedOdors: [],
    happyMemoryOdor: "",
    finalComment: ""
  });
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  const handleAnswer = (answer: string | string[]) => {
    const question = currentQuestion;

    switch (question.id) {
      case "memoryOdor":
        setAnswers(prev => ({
          ...prev,
          strongMemoryOdor: Array.isArray(answer) ? answer.join(", ") : answer
        }));
        break;
      case "dislikedOdors":
        setAnswers(prev => ({ ...prev, dislikedOdors: Array.isArray(answer) ? answer : [] }));
        break;
      case "happyMemory":
        setAnswers(prev => ({
          ...prev,
          happyMemoryOdor: Array.isArray(answer) ? answer.join(", ") : answer
        }));
        break;
      case "firstName":
        setAnswers(prev => ({ ...prev, firstName: answer as string }));
        break;
      case "lastName":
        setAnswers(prev => ({ ...prev, lastName: answer as string }));
        break;
      case "email":
        setAnswers(prev => ({ ...prev, email: answer as string }));
        break;
      case "phone":
        setAnswers(prev => ({ ...prev, phone: answer as string }));
        break;
      case "strongMemory":
        setAnswers(prev => ({ ...prev, hasStrongMemory: answer === "Oui, absolument" }));
        break;
      case "feedback":
        setAnswers(prev => ({ ...prev, finalComment: answer as string }));
        break;
      default:
        if (question.category === "personality") {
          setAnswers(prev => ({
            ...prev,
            personalityAnswers: [...prev.personalityAnswers, answer as string]
          }));
        }
        break;
    }

    // Passage à la question suivante
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer("");
      setSelectedOptions([]);
    } else {
      handleQuizSubmit();
    }
  };

  const handleQuizSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("quiz_results").insert([{
        first_name: answers.firstName,
        last_name: answers.lastName,
        email: answers.email,
        phone: answers.phone || null,
        strong_memory: answers.hasStrongMemory,
        strong_memory_odor: answers.strongMemoryOdor,
        personality_answers: answers.personalityAnswers,
        disliked_odors: answers.dislikedOdors,
        happy_memory_odor: answers.happyMemoryOdor,
        final_comment: answers.finalComment,
        submitted_at: new Date().toISOString(),
      }]);

      if (error) throw error;
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
      setCurrentAnswer("");
      setSelectedOptions([]);
    } else {
      handleQuizSubmit();
    }
  };

  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(prev => prev.filter(o => o !== option));
    } else {
      setSelectedOptions(prev => [...prev, option]);
    }
  };

 const renderQuestionContent = () => {
  const question = currentQuestion;

  if (question.type === "contact") {
    return (
      <div className="space-y-4 mb-8">
        <Input
          type={question.id === "email" ? "email" : question.id === "phone" ? "tel" : "text"}
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder={
            question.id === "firstName" ? "Votre prénom" :
            question.id === "lastName" ? "Votre nom" :
            question.id === "email" ? "votre@email.com" :
            "Optionnel"
          }
          className="bg-card border-border focus:border-cta-orange text-lg p-6 rounded-2xl"
          disabled={isSubmitting}
          required={question.id !== "phone"}
        />
        <Button
          onClick={() => handleAnswer(currentAnswer)}
          disabled={isSubmitting || (!currentAnswer.trim() && question.id !== "phone")}
          className="bg-cta-orange hover:bg-light-orange text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl"
        >
          Continuer
        </Button>
      </div>
    );
  }

  if (question.type === "text") {
    return (
      <div className="space-y-4 mb-8">
        <Textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Partagez vos pensées..."
          className="min-h-[120px] bg-card border-border focus:border-cta-orange text-lg p-6 rounded-2xl resize-none"
          disabled={isSubmitting}
        />
        <Button
          onClick={() => handleAnswer(currentAnswer)}
          disabled={isSubmitting || !currentAnswer.trim()}
          className="bg-cta-orange hover:bg-light-orange text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl"
        >
          {currentQuestionIndex === quizQuestions.length - 1 ? "Terminer le quiz" : "Continuer"}
        </Button>
      </div>
    );
  }

  if (question.type === "multiple_choice") {
    return (
      <div className="space-y-3 mb-8">
        {question.options?.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full text-left p-6 h-auto justify-between bg-card hover:bg-cta-orange/10 hover:border-cta-orange border-border transition-all duration-200 group rounded-2xl shadow-sm hover:shadow-md"
            onClick={() => handleAnswer(option)}
            disabled={isSubmitting}
          >
            <span className="text-foreground text-lg">{option}</span>
            <ChevronRight className="w-5 h-5 text-foreground/40 group-hover:text-cta-orange transition-colors" />
          </Button>
        ))}
      </div>
    );
  }

  if (question.type === "memory") {
    return (
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {question.options?.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={`p-4 h-auto text-center rounded-2xl transition-all duration-200 ${
                currentAnswer === option 
                  ? "bg-cta-orange/20 border-cta-orange text-cta-orange" 
                  : "bg-card hover:bg-secondary border-border"
              }`}
              onClick={() => setCurrentAnswer(option)}
              disabled={isSubmitting}
            >
              {option}
            </Button>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <Input
            value={currentAnswer.includes("Autre: ") ? currentAnswer.replace("Autre: ", "") : ""}
            onChange={(e) => setCurrentAnswer(`Autre: ${e.target.value}`)}
            placeholder="Ou décrivez votre propre souvenir..."
            className="bg-card border-border focus:border-cta-orange rounded-2xl"
            disabled={isSubmitting}
          />
        </div>
        <Button
          onClick={() => handleAnswer(currentAnswer)}
          disabled={isSubmitting || !currentAnswer.trim()}
          className="bg-cta-orange hover:bg-light-orange text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl"
        >
          Continuer
        </Button>
      </div>
    );
  }

  if (question.type === "image_selection") {
    return (
      <div className="space-y-6 mb-8">
        {/* Suggestions par familles olfactives */}
        <div className="mb-4">
          {Object.entries(famillesDescripteurs).map(([famille, mots]) => (
            <div key={famille} className="mb-2">
              <h3 className="text-base font-semibold text-foreground/80 mb-1">{famille}</h3>
              <div className="flex flex-wrap gap-2">
                {mots.map((mot) => (
                  <Button
                    key={mot}
                    variant="outline"
                    className={`rounded-xl px-4 py-2 text-sm ${
                      selectedOptions.includes(mot)
                        ? "bg-cta-orange/20 border-cta-orange text-cta-orange"
                        : "bg-card hover:bg-secondary border-border"
                    }`}
                    onClick={() => toggleOption(mot)}
                    disabled={isSubmitting}
                  >
                    {mot}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {question.options?.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={`p-4 h-auto text-center rounded-2xl transition-all duration-200 ${
                selectedOptions.includes(option)
                  ? "bg-cta-orange/20 border-cta-orange text-cta-orange"
                  : "bg-card hover:bg-secondary border-border"
              }`}
              onClick={() => toggleOption(option)}
              disabled={isSubmitting}
            >
              <span className="text-sm">{option}</span>
            </Button>
          ))}
        </div>
        {/* Champ libre pour memoryOdor et happyMemory */}
        {["memoryOdor", "happyMemory"].includes(question.id) && (
          <div className="flex items-center space-x-4 mt-4">
            <Input
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Ajoutez votre propre souvenir olfactif..."
              className="bg-card border-border focus:border-cta-orange rounded-2xl"
              disabled={isSubmitting}
            />
            <Button
              onClick={() => {
                if (currentAnswer.trim() && !selectedOptions.includes(currentAnswer.trim())) {
                  setSelectedOptions([...selectedOptions, currentAnswer.trim()]);
                  setCurrentAnswer("");
                }
              }}
              disabled={isSubmitting || !currentAnswer.trim()}
              className="bg-cta-orange text-white rounded-2xl"
            >
              Ajouter
            </Button>
          </div>
        )}
        <Button
          onClick={() => handleAnswer(selectedOptions)}
          disabled={isSubmitting || selectedOptions.length === 0}
          className="bg-cta-orange hover:bg-light-orange text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl w-full"
        >
          Valider ma sélection {selectedOptions.length > 0 && `(${selectedOptions.length})`}
        </Button>
      </div>
    );
  }

  return null;
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-secondary to-cream py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Barre de progression */}
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

        {/* Affichage de la carte */}
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            {/* Avatar et question */}
            <div className="flex items-start space-x-6 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cta-orange to-light-orange rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white text-2xl">🐺</span>
              </div>
              <div className="flex-1">
                <div className="bg-secondary/50 rounded-3xl rounded-tl-sm p-6 shadow-sm">
                  <p className="text-xl leading-relaxed text-foreground">{currentQuestion.question}</p>
                </div>
              </div>
            </div>

            {/* Contenu de la question */}
            {renderQuestionContent()}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0 || isSubmitting}
                className="text-foreground/60 hover:text-foreground hover:bg-secondary rounded-2xl px-6"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>
              {currentQuestion.type === "multiple_choice" && (
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  disabled={isSubmitting}
                  className="text-foreground/60 hover:text-foreground hover:bg-secondary rounded-2xl px-6"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Passer
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
