import { QuizAnswers, OlfactoryProfile } from "@/types";

const BACKEND_URL = "https://wolfactiv-backend.onrender.com";

export async function submitQuiz(answers: QuizAnswers): Promise<OlfactoryProfile> {
  const response = await fetch(`${BACKEND_URL}/submit_quiz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answers }),
  });

  if (!response.ok) {
    throw new Error(`Quiz submission failed: ${response.statusText}`);
  }

  return response.json();
}
