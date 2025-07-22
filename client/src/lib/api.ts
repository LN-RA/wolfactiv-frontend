const BACKEND_URL = "https://wolfactiv-backend.onrender.com";

export async function submitQuiz(data: {
  goûts: string[];
  questions_psy: string;
}) {
  const response = await fetch(`${BACKEND_URL}/submit_quiz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Quiz submission failed: ${response.statusText}`);
  }

  return await response.json();
}
