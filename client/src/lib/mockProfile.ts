import { OlfactoryProfile } from "@/types";

export const mockProfile: OlfactoryProfile = {
  profil_nom: "Le Visionnaire",
  citation: "La vie est une aventure audacieuse ou rien du tout.",
  parfums: [
    {
      nom: "Try. The Magic of Bali",
      marque: "Scentception",
      score: 89.02,
      image: "https://www.dropbox.com/scl/fi/3eo5hkseie5fkn6971sog/SENTCEPTION_MAGIC_OF_BALI_04781.webp?rlkey=chol3vpyfmsv3aj5rsjzhnmki&st=60xptavs&dl=0",
      lien_achat: "https://scentception.com/collections/shop",
      description: "Un floral solaire enivrant.",
    },
  ],
  radar_data: {
    Florale: 85,
    Épicée: 70,
    Ambrée: 65,
    "Boisée Mousse": 50,
    "Fleur d'Oranger": 60,
  },
};
