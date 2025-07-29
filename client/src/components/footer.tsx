import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cta-orange to-light-orange rounded-full flex items-center justify-center">
                <span className="text-primary-dark text-lg font-bold">🐺</span>
              </div>
              <span className="text-xl font-serif font-semibold">Wolfactiv</span>
            </div>
            <p className="text-foreground/60 mb-6 max-w-md">
              Découvrez votre signature olfactive grâce à notre quiz personnalisé et explorez l'univers des parfums de niche.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground/60 hover:text-cta-orange transition-colors">
                <span className="sr-only">Instagram</span>
                📷
              </a>
              <a href="#" className="text-foreground/60 hover:text-cta-orange transition-colors">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-foreground/60 hover:text-cta-orange transition-colors">
                <span className="sr-only">LinkedIn</span>
                💼
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-4">Navigation</h4>
            <ul className="space-y-2 text-foreground/60">
              <li><Link href="/" className="hover:text-foreground transition-colors">Accueil</Link></li>
              <li><Link href="/quiz" className="hover:text-foreground transition-colors">Quiz</Link></li>
              <li><Link href="/profile" className="hover:text-foreground transition-colors">Profil</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif text-lg mb-4">Légal</h4>
            <ul className="space-y-2 text-foreground/60">
              <li><a href="#" className="hover:text-foreground transition-colors">Mentions légales</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Confidentialité</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">CGU</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-foreground/60">
          <p>&copy; 2024 Wolfactiv. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

