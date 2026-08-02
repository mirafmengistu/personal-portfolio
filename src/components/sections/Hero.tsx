import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, ArrowDown, Download } from "lucide-react";
import { FaGithub as Github, FaLinkedin as Linkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface ProfileData {
  name: string;
  title: string;
  bio: string;
  resume_url: string | null;
  resume_name: string | null;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface HeroData {
  greeting: string;
  animated_texts: string[];
  primary_cta: string;
  secondary_cta: string;
  primary_cta_link: string;
  secondary_cta_link: string;
  show_social_links: boolean;
  enable_animated_text: boolean;
}

export const Hero = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profile')
        .select('*')
        .single();
      
      if (profileData) setProfile(profileData);
      
      // Fetch social links
      const { data: socialData, error: socialError } = await supabase
        .from('social_links')
        .select('*');
      
      if (socialData) setSocialLinks(socialData);
      
      // Fetch hero data
      const { data: heroSection, error: heroError } = await supabase
        .from('hero_section')
        .select('*')
        .single();

      if (heroSection) setHeroData(heroSection);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Force download function
  const downloadFile = async (url: string, fileName: string) => {
    try {
      // Show downloading indicator (optional)
      const toastId = toast.loading("Downloading resume...");
      
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      toast.dismiss(toastId);
      toast.success("Download started!");
    } catch (error) {
      console.error('Download failed:', error);
      toast.error("Download failed. Opening in browser...");
      // Fallback: open in new tab
      window.open(url, '_blank');
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  if (loading) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </section>
    );
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <motion.div {...fadeInUp}>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            {heroData?.greeting || "Hi, I'm"}{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {profile?.name || "Your Name"}
            </span>
          </h1>
          {heroData?.enable_animated_text && heroData?.animated_texts && heroData.animated_texts.length > 0 && (
            <h2 className="text-2xl md:text-3xl text-muted-foreground">
              {heroData.animated_texts[0]}
            </h2>
          )}
        </motion.div>

        <motion.p 
          {...fadeInUp}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          {profile?.bio || "Building exceptional digital experiences with modern web technologies."}
        </motion.p>

        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.2 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Button size="lg" asChild>
            <a href={heroData?.primary_cta_link || "#projects"}>
              {heroData?.primary_cta || "View Projects"}
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href={heroData?.secondary_cta_link || "#contact"}>
              {heroData?.secondary_cta || "Contact Me"}
            </a>
          </Button>
          {profile?.resume_url && (
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => downloadFile(profile.resume_url!, profile.resume_name || "resume.pdf")}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Resume
            </Button>
          )}
        </motion.div>

        {heroData?.show_social_links && (
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            className="flex gap-6 justify-center pt-8"
          >
            {socialLinks.map((link, index) => {
              if (link.platform === 'github') {
                return (
                  <a 
                    key={index}
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github size={24} />
                  </a>
                );
              }
              if (link.platform === 'linkedin') {
                return (
                  <a 
                    key={index}
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin size={24} />
                  </a>
                );
              }
              if (link.platform === 'email') {
                return (
                  <a 
                    key={index}
                    href={link.url} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail size={24} />
                  </a>
                );
              }
              return null;
            })}
          </motion.div>
        )}

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
        >
          <ArrowDown className="text-muted-foreground" />
        </motion.div>
      </div>
    </section>
  );
};