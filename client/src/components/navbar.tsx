import { useState } from "react";
import { Link, useLocation } from "wouter";
import { User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "./auth-modal";
import { getAuth, clearAuth } from "@/lib/auth";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const user = getAuth();

  const handleLogout = () => {
    clearAuth();
    setLocation("/");
    window.location.reload();
  };

  const navItems = [
    { href: "/", label: "Accueil" },
    { href: "/quiz", label: "Quiz" },
    { href: "/profile", label: "Profil" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full bg-card/95 backdrop-blur-sm z-50 border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/">
              <div className="flex items-center space-x-4 cursor-pointer hover:scale-105 transition-transform duration-200">
                <div className="w-12 h-12 bg-gradient-to-br from-cta-orange to-light-orange rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🐺</span>
                </div>
                <span className="text-2xl font-serif font-semibold text-primary-dark">Wolfactiv</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant="ghost" 
                    className={`font-medium text-lg px-4 py-2 rounded-2xl transition-all ${
                      location === item.href 
                        ? "text-cta-orange bg-cta-orange/10" 
                        : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>

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
              
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a 
                    className={`block transition-colors ${
                      location === item.href 
                        ? "text-cta-orange" 
                        : "text-foreground/80 hover:text-foreground"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
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

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}
