import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu, X, Sparkles } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-background/80 backdrop-blur-md border-b border-border" 
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <a 
              href="#home" 
              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              aria-label="Home"
            >
              Portfolio
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm lg:text-base font-medium text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4"
                >
                  {item.name}
                </a>
              ))}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className="h-9 w-9 lg:h-10 lg:w-10 rounded-full hover:bg-primary/10 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 lg:h-5 lg:w-5" />
                ) : (
                  <Moon className="h-4 w-4 lg:h-5 lg:w-5" />
                )}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className="h-9 w-9 rounded-full hover:bg-primary/10 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(!isOpen)}
                className="h-9 w-9 rounded-full hover:bg-primary/10 transition-colors"
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          style={{ top: '64px' }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="relative bg-background border-b border-border shadow-xl animate-in slide-in-from-top duration-300">
            <div className="max-w-6xl mx-auto px-4 py-6">
              <div className="flex flex-col space-y-1">
                {navItems.map((item, index) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-4 py-3 text-base font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
                    onClick={handleLinkClick}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <span className="w-1 h-1 bg-primary/30 rounded-full mr-3"></span>
                    {item.name}
                  </a>
                ))}
                
                {/* Mobile Menu Footer */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    © {new Date().getFullYear()} Portfolio
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};