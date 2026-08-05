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
  avatar_url: string | null;
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

  // Typing animation states
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (!heroData?.enable_animated_text || !heroData?.animated_texts?.length) {
      setDisplayText(heroData?.animated_texts?.[0] || "Full Stack Developer");
      return;
    }

    const texts = heroData.animated_texts;
    const currentText = texts[currentIndex];

    let timeout: ReturnType<typeof setTimeout>;

    if (isTyping) {
      if (displayText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, 80);
      } else {
        setIsPaused(true);
        timeout = setTimeout(() => {
          setIsPaused(false);
          setIsTyping(false);
        }, 2000);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 40);
      } else {
        const nextIndex = (currentIndex + 1) % texts.length;
        setCurrentIndex(nextIndex);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, currentIndex, isPaused, heroData]);

  const fetchData = async () => {
    try {
      const { data: profileData } = await supabase
        .from("profile")
        .select("*")
        .single();

      if (profileData) setProfile(profileData);

      const { data: socialData } = await supabase.from("social_links").select("*");
      if (socialData) setSocialLinks(socialData);

      const { data: heroSection } = await supabase
        .from("hero_section")
        .select("*")
        .single();

      if (heroSection) {
        setHeroData(heroSection);
        if (heroSection.animated_texts?.length > 0) {
          setDisplayText(heroSection.animated_texts[0]);
        }
      }
    } catch (error) {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (url: string, fileName: string) => {
    try {
      const toastId = toast.loading("Downloading resume...");
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.dismiss(toastId);
      toast.success("Download started!");
    } catch {
      toast.error("Download failed. Opening in browser...");
      window.open(url, "_blank");
    }
  };

  if (loading) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* ========== CINEMATIC BACKGROUND ========== */}
      <div className="absolute inset-0 -z-10">
        {/* Photo as background (blurred + darkened) */}
        {profile?.avatar_url && (
          <img
            src={profile.avatar_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center scale-110 opacity-40 dark:opacity-30"
          />
        )}

        {/* Strong cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
        <div className="absolute inset-0 bg-background/20" />
      </div>

      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[80vh]">
          
          {/* ========== LEFT CONTENT ========== */}
          <div className="space-y-8 text-center lg:text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-primary font-medium tracking-[0.2em] text-sm uppercase mb-4">
                {heroData?.greeting || "Hi, I'm"}
              </p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]">
                {profile?.name || "Your Name"}
              </h1>
            </motion.div>

            {/* Animated Role */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="h-12 flex items-center justify-center lg:justify-start"
            >
              {heroData?.enable_animated_text &&
              heroData?.animated_texts &&
              heroData.animated_texts.length > 0 ? (
                <h2 className="text-2xl sm:text-3xl text-muted-foreground font-medium">
                  {displayText}
                  <span className="inline-block w-0.5 h-6 sm:h-7 bg-primary ml-1.5 animate-pulse" />
                </h2>
              ) : (
                <h2 className="text-2xl sm:text-3xl text-muted-foreground">
                  {heroData?.animated_texts?.[0] || "Full Stack Developer"}
                </h2>
              )}
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              {profile?.bio ||
                "Building exceptional digital experiences with modern web technologies."}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" asChild className="min-w-[150px] h-12 text-base">
                <a href={heroData?.primary_cta_link || "#projects"}>
                  {heroData?.primary_cta || "View Projects"}
                </a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="min-w-[150px] h-12 text-base border-muted-foreground/30 hover:bg-background/50"
              >
                <a href={heroData?.secondary_cta_link || "#contact"}>
                  {heroData?.secondary_cta || "Contact Me"}
                </a>
              </Button>

              {profile?.resume_url && (
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12"
                  onClick={() =>
                    downloadFile(
                      profile.resume_url!,
                      profile.resume_name || "resume.pdf"
                    )
                  }
                >
                  <Download className="mr-2 h-4 w-4" />
                  Resume
                </Button>
              )}
            </motion.div>

            {/* Social Links */}
            {heroData?.show_social_links && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex gap-6 justify-center lg:justify-start pt-2"
              >
                {socialLinks.map((link, index) => {
                  if (link.platform === "github") {
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="GitHub"
                      >
                        <Github size={24} />
                      </a>
                    );
                  }
                  if (link.platform === "linkedin") {
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin size={24} />
                      </a>
                    );
                  }
                  if (link.platform === "email") {
                    return (
                      <a
                        key={index}
                        href={link.url}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Email"
                      >
                        <Mail size={24} />
                      </a>
                    );
                  }
                  return null;
                })}
              </motion.div>
            )}
          </div>

          {/* ========== RIGHT FEATURED PHOTO ========== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:flex justify-end items-center"
          >
            <div className="relative">
              {/* Glow behind photo */}
              <div className="absolute -inset-8 bg-primary/20 rounded-full blur-3xl" />

              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name || "Profile photo"}
                  className="relative w-[380px] h-[480px] object-cover rounded-2xl shadow-2xl border border-white/10"
                />
              ) : (
                <div className="w-[380px] h-[480px] rounded-2xl bg-muted/50 flex items-center justify-center border border-white/10">
                  <span className="text-muted-foreground">No photo</span>
                </div>
              )}

              {/* Cinematic frame accent */}
              <div className="absolute -inset-3 border border-primary/30 rounded-2xl -z-10" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-20"
        onClick={() =>
          document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <ArrowDown className="text-muted-foreground hover:text-primary transition-colors" size={28} />
      </motion.div>
    </section>
  );
};