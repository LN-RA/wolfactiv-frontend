import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { saveAuth } from "@/lib/auth";
import { User } from "@/types";
import { supabase } from "@/lib/supabaseClient";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

const signupSchema = loginSchema.extend({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().optional(),
});

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignup, setIsSignup] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      let result;
      if (isSignup) {
        result = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              firstName: data.firstName,
              lastName: data.lastName,
            },
          },
        });
      } else {
        result = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
      }

      const { error, data: sessionData } = result;

      if (error) throw error;

      const user = sessionData.user;
      if (!user) throw new Error("Utilisateur non retourné");

      saveAuth({
        id: user.id,
        email: user.email!,
        firstName: user.user_metadata?.firstName || "",
        lastName: user.user_metadata?.lastName || "",
      });

      toast({
        title: isSignup ? "Compte créé" : "Connexion réussie",
        description: isSignup ? "Bienvenue chez Wolfactiv !" : "Bienvenue de retour !",
      });

      onClose();
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border border-border">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cta-orange to-light-orange rounded-full flex items-center justify-center mb-4">
              <span className="text-primary-dark text-xl font-bold">🐺</span>
            </div>
            {isSignup ? "Créer un compte" : "Se connecter"}
          </DialogTitle>
          <p className="text-center text-foreground/60">
            {isSignup ? "Rejoignez la communauté Wolfactiv" : "Accédez à vos résultats sauvegardés"}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {isSignup && (
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Votre prénom" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {isSignup && (
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom (optionnel)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Votre nom" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="votre@email.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="••••••••" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-cta-orange hover:bg-light-orange text-primary-dark"
            >
              {isSignup ? "Créer mon compte" : "Se connecter"}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setIsSignup(!isSignup)}
            className="text-foreground/60 hover:text-cta-orange"
          >
            {isSignup 
              ? "Déjà un compte ? Se connecter" 
              : "Pas encore de compte ? Créer un compte"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
