import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { FaGithub as Github } from "react-icons/fa";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  featured: boolean;
}

export const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [allTags, setAllTags] = useState<string[]>(["All"]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setProjects(data);
        // Extract unique tags
        const tags = new Set<string>();
        data.forEach(project => {
          project.tags?.forEach((tag: string) => tags.add(tag));
        });
        setAllTags(["All", ...Array.from(tags).sort()]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(p => p.tags?.includes(filter));

  if (loading) {
    return (
      <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading projects...</p>
        </div>
      </section>
    );
  }

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
        {allTags.length > 1 && (
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
        )}

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found in this category.</p>
          </div>
        ) : (
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
                <Card className="h-full flex flex-col hover:shadow-lg transition-all hover:-translate-y-1">
                  {project.image_url && (
                    <div className="w-full h-48 overflow-hidden rounded-t-lg">
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.slice(0, 4).map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags?.length > 4 && (
                        <Badge variant="secondary">
                          +{project.tags.length - 4}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="gap-4">
                    {project.github_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" /> Code
                        </a>
                      </Button>
                    )}
                    {project.live_url && (
                      <Button size="sm" asChild>
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};