import { useEffect, useState } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

// ✅ Initialisation Stripe conditionnelle
const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripeKey && stripeKey !== "disable" ? loadStripe(stripeKey) : null;

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/profile`,
      },
    });

    if (error) {
      toast({
        title: "Paiement échoué",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Paiement réussi",
        description: "Merci pour votre commande ! Vous recevrez vos échantillons sous 3-5 jours.",
      });
      localStorage.removeItem("wolfactiv_sample_set");
      setLocation("/profile");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-cta-orange hover:bg-light-orange text-primary-dark"
        size="lg"
      >
        {isLoading ? "Traitement..." : "Confirmer le paiement - 15€"}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [sampleSet, setSampleSet] = useState<any>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const storedSampleSet = localStorage.getItem("wolfactiv_sample_set");
    if (!storedSampleSet) {
      setLocation("/");
      return;
    }

    try {
      const parsedSampleSet = JSON.parse(storedSampleSet);
      setSampleSet(parsedSampleSet);

      if (!stripePromise) return;

      apiRequest("POST", "/api/create-payment-intent", {
        amount: parsedSampleSet.amount
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error("Erreur lors de la création du paiement :", error);
          setLocation("/");
        });
    } catch (error) {
      setLocation("/");
    }
  }, [setLocation]);

  if (!sampleSet) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary py-20">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif mb-4">Finaliser votre commande</h1>
          <p className="text-foreground/80">Set d'échantillons personnalisé</p>
        </div>

        <div className="grid gap-8">
          {/* Récapitulatif */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="font-serif">Récapitulatif de commande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Set de 5 échantillons personnalisés</span>
                  <span className="font-semibold">15,00€</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total</span>
                    <span>15,00€</span>
                  </div>
                </div>
                <p className="text-sm text-foreground/60 mt-4">
                  💡 Le prix du set est remboursé lors de l'achat d'un parfum full size
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Paiement */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="font-serif">Informations de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              {stripePromise && clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm />
                </Elements>
              ) : (
                <p className="text-center text-sm text-red-500">
                  ⚠️ Le paiement est temporairement désactivé.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-foreground/60">
            🔒 Paiement sécurisé avec Stripe • Livraison sous 3-5 jours
          </p>
        </div>
      </div>
    </div>
  );
}

