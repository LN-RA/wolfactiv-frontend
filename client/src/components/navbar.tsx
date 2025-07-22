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
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-cta-orange to-light-orange rounded-full flex items-center justify-center">
                  <span className="text-primary-dark text-lg font-bold">🐺</span>
                </div>
                <span className="text-xl font-serif font-semibold">Wolfactiv</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a className={`transition-colors ${
                    location === item.href 
                      ? "text-cta-orange" 
                      : "text-foreground/80 hover:text-foreground"
                  }`}>
                    {item.label}
                  </a>
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
