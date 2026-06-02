import { Button } from "@/components/ui/button";
import { Mail, ArrowDown } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

export const Hero = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <motion.div {...fadeInUp}>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Hi, I'm{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Your Name
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl text-muted-foreground">
            Full Stack Developer
          </h2>
        </motion.div>

        <motion.p 
          {...fadeInUp}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          I build exceptional digital experiences with React, Node.js, and modern web technologies.
          Passionate about creating performant and user-friendly applications.
        </motion.p>

        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.2 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Button size="lg" asChild>
            <a href="#projects">View Projects</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#contact">Contact Me</a>
          </Button>
        </motion.div>

        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.3 }}
          className="flex gap-6 justify-center pt-8"
        >
          <a 
            href="https://github.com/yourusername" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <FaGithub size={24} />
          </a>
          <a 
            href="https://linkedin.com/in/yourusername" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <FaLinkedin size={24} />
          </a>
          <a 
            href="mailto:your.email@example.com"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail size={24} />
          </a>
        </motion.div>

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