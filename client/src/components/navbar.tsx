import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "./auth-modal";
import { getAuth, clearAuth } from "@/lib/auth";
import { useState, useEffect } from "react";

import { User } from "lucide-react";


export function Navbar() {
  const [location, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  const fetchUser = async () => {
    const currentUser = await getAuth();
    setUser(currentUser);
  };
  fetchUser();
}, []);

  const navItems = [
    { href: "/", label: "Accueil" },
    { href: "/quiz", label: "Quiz" },
    { href: "/profile", label: "Profil" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location === path;

  const handleLogout = () => {
    clearAuth();
    setLocation("/");
    window.location.reload(); // à remplacer par une gestion d'état global plus tard
  };

  return (
    <>
      <nav
        className="fixed top-0 w-full bg-card/95 backdrop-blur-sm z-50 border-b border-border shadow-sm"
        role="navigation"
        aria-label="Navigation principale"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-4 cursor-pointer hover:scale-105 transition-transform duration-200">
                <div className="w-12 h-12 bg-gradient-to-br from-cta-orange to-light-orange rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl" aria-label="Logo">🐺</span>
                </div>
                <span className="text-2xl font-serif font-semibold text-primary-dark">Wolfactiv</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium text-lg px-4 py-2 rounded-2xl transition-all ${
                    isActive(item.href)
                      ? "text-cta-orange bg-cta-orange/10"
                      : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right side: auth + menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="hidden md:flex items-center space-x-4">
                  <span className="text-sm text-foreground/60">
                    {user.firstName || user.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-foreground/60 hover:text-foreground"
                  >
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-foreground/80 hover:text-foreground"
                >
                  <User className="w-5 h-5" />
                </Button>
              )}

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Ouvrir le menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block text-lg px-2 py-1 rounded transition-colors ${
                    isActive(item.href)
                      ? "text-cta-orange"
                      : "text-foreground/80 hover:text-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Auth Buttons (mobile) */}
              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start text-foreground/60 hover:text-foreground"
                >
                  Déconnexion
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start text-foreground/80 hover:text-foreground"
                >
                  Se connecter
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
