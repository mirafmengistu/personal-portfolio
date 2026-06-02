import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string; // Added image property
}

const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with shopping cart, user authentication, and payment integration.",
    tags: ["React", "Node.js", "MongoDB", "Tailwind"],
    githubUrl: "https://github.com/yourusername/ecommerce",
    liveUrl: "https://ecommerce-demo.com",
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Productivity app with drag-and-drop, real-time updates, and team collaboration features.",
    tags: ["React", "TypeScript", "Express", "PostgreSQL"],
    githubUrl: "https://github.com/yourusername/taskmanager",
    liveUrl: "https://taskmanager-demo.com",
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: 3,
    title: "Portfolio Website",
    description: "Modern portfolio website with dark mode, animations, and responsive design.",
    tags: ["React", "Tailwind", "Framer Motion"],
    githubUrl: "https://github.com/yourusername/portfolio",
    liveUrl: "https://yourportfolio.com",
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: 4,
    title: "Weather Dashboard",
    description: "Real-time weather app with 5-day forecast, interactive maps, and location detection.",
    tags: ["React", "API", "Chart.js", "CSS"],
    githubUrl: "https://github.com/yourusername/weather",
    liveUrl: "https://weather-demo.com",
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: 5,
    title: "Social Media Dashboard",
    description: "Analytics dashboard for social media metrics with data visualization and reports.",
    tags: ["React", "D3.js", "Firebase", "Tailwind"],
    githubUrl: "https://github.com/yourusername/social-dashboard",
    liveUrl: "https://social-demo.com",
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: 6,
    title: "AI Image Generator",
    description: "Generate unique images using AI with prompt engineering and gallery features.",
    tags: ["React", "OpenAI API", "Node.js", "MongoDB"],
    githubUrl: "https://github.com/yourusername/ai-generator",
    liveUrl: "https://ai-generator-demo.com",
    image: "https://via.placeholder.com/300x200",
  },
];

export const Projects = () => {
  const [filter, setFilter] = useState<string>("All");
  
  // Get unique tags from all projects
  const allTags = ["All", ...new Set(projects.flatMap(p => p.tags))];
  
  // Filter projects based on selected tag
  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(p => p.tags.includes(filter));

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Here are some of my recent projects. Each one was built with passion and attention to detail.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 justify-center mb-12"
        >
          {allTags.map(tag => (
            <Button
              key={tag}
              variant={filter === tag ? "default" : "outline"}
              onClick={() => setFilter(tag)}
              size="sm"
              className="transition-all"
            >
              {tag}
            </Button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden">
                {/* Project Image */}
                {project.image && (
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="gap-4">
                  {project.githubUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <FaGithub className="mr-2 h-4 w-4" /> Code
                      </a>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button size="sm" asChild>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};