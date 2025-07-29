import { QuizQuestion } from "@/types";

export const quizQuestions: QuizQuestion[] = [
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
    type: "image_selection",
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
