import { useEffect, useState } from "react";
import { Heart, Mail, ArrowUp, Link2, Code2 } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface FooterData {
  brand_name: string;
  brand_tagline: string;
  copyright_text: string;
  built_with: string[];
  show_quick_links: boolean;
  show_social_links: boolean;
  show_built_with: boolean;
  quick_links: { id: string; label: string; url: string }[];
}

interface SocialLink {
  platform: string;
  url: string;
}

export const Footer = () => {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch footer settings
      const { data: footerSettings, error: footerError } = await supabase
        .from('footer_settings')
        .select('*')
        .single();
      
      if (footerError) {
        console.error("Footer error:", footerError);
      }
      
      if (footerSettings) {
        setFooterData(footerSettings);
      } else {
        // Fallback data if nothing in database
        setFooterData({
          brand_name: "Portfolio",
          brand_tagline: "Building exceptional digital experiences with modern web technologies.",
          copyright_text: "All rights reserved.",
          built_with: ["React", "TypeScript", "Tailwind"],
          show_quick_links: true,
          show_social_links: true,
          show_built_with: true,
          quick_links: [
            { id: "1", label: "Home", url: "#home" },
            { id: "2", label: "Projects", url: "#projects" },
            { id: "3", label: "Skills", url: "#skills" },
            { id: "4", label: "Contact", url: "#contact" },
          ]
        });
      }
      
      // Fetch social links
      const { data: socialData } = await supabase
        .from('social_links')
        .select('*');
      
      if (socialData) {
        setSocialLinks(socialData);
      } else {
        // Fallback social links
        setSocialLinks([
          { platform: 'github', url: 'https://github.com/yourusername' },
          { platform: 'linkedin', url: 'https://linkedin.com/in/yourusername' },
          { platform: 'email', url: 'mailto:your.email@example.com' },
        ]);
      }
    } catch (error) {
      console.error("Error fetching footer data:", error);
      // Set fallback data on error
      setFooterData({
        brand_name: "Portfolio",
        brand_tagline: "Building exceptional digital experiences with modern web technologies.",
        copyright_text: "All rights reserved.",
        built_with: ["React", "TypeScript", "Tailwind"],
        show_quick_links: true,
        show_social_links: true,
        show_built_with: true,
        quick_links: [
          { id: "1", label: "Home", url: "#home" },
          { id: "2", label: "Projects", url: "#projects" },
          { id: "3", label: "Skills", url: "#skills" },
          { id: "4", label: "Contact", url: "#contact" },
        ]
      });
      setSocialLinks([
        { platform: 'github', url: 'https://github.com/yourusername' },
        { platform: 'linkedin', url: 'https://linkedin.com/in/yourusername' },
        { platform: 'email', url: 'mailto:your.email@example.com' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'github': return <FaGithub className="h-4 w-4" />;
      case 'linkedin': return <FaLinkedin className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      default: return <Link2 className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <footer className="bg-card border-t mt-20">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </footer>
    );
  }

  if (!footerData) return null;

  return (
    <footer className="bg-card border-t mt-16 md:mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Brand Section */}
          <div className="space-y-3 text-center sm:text-left">
            <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {footerData.brand_name || "Portfolio"}
            </h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xs mx-auto sm:mx-0">
              {footerData.brand_tagline || "Building exceptional digital experiences."}
            </p>
            {footerData.show_social_links !== false && socialLinks.length > 0 && (
              <div className="flex gap-2 pt-2 justify-center sm:justify-start">
                {socialLinks.map((link) => (
                  <Button 
                    key={link.platform} 
                    variant="ghost" 
                    size="icon" 
                    asChild 
                    className="h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-primary/10 transition-colors"
                  >
                    <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform}>
                      {getSocialIcon(link.platform)}
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          {footerData.show_quick_links !== false && footerData.quick_links && footerData.quick_links.length > 0 && (
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-sm md:text-base mb-3 md:mb-4">Quick Links</h4>
              <ul className="space-y-1.5 md:space-y-2">
                {footerData.quick_links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Built With */}
          {footerData.show_built_with !== false && footerData.built_with && footerData.built_with.length > 0 && (
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-sm md:text-base mb-3 md:mb-4 flex items-center justify-center sm:justify-start gap-2">
                <Code2 className="h-4 w-4" />
                Built With
              </h4>
              <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center sm:justify-start">
                {footerData.built_with.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 bg-secondary rounded-full text-muted-foreground border border-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p className="text-xs md:text-sm text-center md:text-left">
              © {currentYear} {footerData.brand_name}. {footerData.copyright_text || "All rights reserved."}
            </p>
            <p className="flex items-center gap-1 text-xs md:text-sm">
              Made with <Heart className="h-3 w-3 text-red-500 fill-current" /> using React
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="gap-2 text-xs md:text-sm hover:bg-primary/10 transition-colors"
            >
              <ArrowUp className="h-4 w-4" />
              Back to Top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};