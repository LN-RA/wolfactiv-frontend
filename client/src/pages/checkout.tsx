import { useEffect, useState } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

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
      // Clear sample set data
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

      // Create PaymentIntent
      apiRequest("POST", "/api/create-payment-intent", { 
        amount: parsedSampleSet.amount 
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error("Error creating payment intent:", error);
          setLocation("/");
        });
    } catch (error) {
      setLocation("/");
    }
  }, [setLocation]);

  if (!clientSecret || !sampleSet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-cta-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Préparation du paiement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary py-20">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif mb-4">Finaliser votre commande</h1>
          <p className="text-foreground/80">Set d'échantillons personnalisé</p>
        </div>

        <div className="grid gap-8">
          {/* Order Summary */}
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

          {/* Payment Form */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="font-serif">Informations de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
              </Elements>
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
