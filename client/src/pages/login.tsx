import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLocation } from "wouter";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, navigate] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Erreur de connexion : " + error.message);
    } else {
      alert("Connecté !");
      navigate("/results");
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-4 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">Connexion</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="w-full bg-black text-white p-2 rounded">
        Se connecter
      </button>
    </form>
  );
}
