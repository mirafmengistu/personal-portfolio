import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Star, 
  X, 
  
  Link2,
  Image as ImageIcon,
  FolderGit2
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import type { Project } from "@/types/admin";

export const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [] as string[],
    github_url: "",
    live_url: "",
    image_url: "",
    featured: false,
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error("Failed to load projects");
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      toast.error("Title and description are required");
      return;
    }

    if (editingProject) {
      const { error } = await supabase
        .from('projects')
        .update({
          title: formData.title,
          description: formData.description,
          tags: formData.tags,
          github_url: formData.github_url,
          live_url: formData.live_url,
          image_url: formData.image_url,
          featured: formData.featured,
          updated_at: new Date(),
        })
        .eq('id', editingProject.id);

      if (error) {
        toast.error("Failed to update project");
      } else {
        toast.success("Project updated successfully!");
        fetchProjects();
        resetForm();
        setIsDialogOpen(false);
      }
    } else {
      const { error } = await supabase
        .from('projects')
        .insert([{
          title: formData.title,
          description: formData.description,
          tags: formData.tags,
          github_url: formData.github_url,
          live_url: formData.live_url,
          image_url: formData.image_url,
          featured: formData.featured,
        }]);

      if (error) {
        toast.error("Failed to create project");
      } else {
        toast.success("Project created successfully!");
        fetchProjects();
        resetForm();
        setIsDialogOpen(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error("Failed to delete project");
      } else {
        toast.success("Project deleted successfully!");
        fetchProjects();
      }
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      tags: project.tags,
      github_url: project.github_url || "",
      live_url: project.live_url || "",
      image_url: project.image_url || "",
      featured: project.featured || false,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      tags: [],
      github_url: "",
      live_url: "",
      image_url: "",
      featured: false,
    });
    setTagInput("");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Projects Manager</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => resetForm()} 
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl md:text-2xl">
                {editingProject ? "Edit Project" : "Add New Project"}
              </DialogTitle>
              <DialogDescription className="text-sm md:text-base">
                Fill in the details for your project
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 md:space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm md:text-base font-medium">
                  Project Title <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <FolderGit2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., E-Commerce Platform"
                    className="pl-10 h-10 md:h-11 text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm md:text-base font-medium">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project..."
                  rows={4}
                  className="min-h-[100px] md:min-h-[120px] text-base resize-y"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm md:text-base font-medium">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="e.g., React, TypeScript"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="h-10 md:h-11 text-base flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddTag}
                    className="flex-shrink-0"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 px-2 py-1 text-xs md:text-sm">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-red-500 transition-colors" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                  {formData.tags.length === 0 && (
                    <p className="text-xs text-muted-foreground">No tags added yet</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="github_url" className="text-sm md:text-base font-medium">GitHub URL</Label>
                  <div className="relative">
                    <FaGithub className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="github_url"
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      placeholder="https://github.com/username/project"
                      className="pl-10 h-10 md:h-11 text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="live_url" className="text-sm md:text-base font-medium">Live Demo URL</Label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="live_url"
                      value={formData.live_url}
                      onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                      placeholder="https://project-demo.com"
                      className="pl-10 h-10 md:h-11 text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url" className="text-sm md:text-base font-medium">Image URL</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="pl-10 h-10 md:h-11 text-base"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Optional. Recommended size: 800x450px</p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="featured" className="text-sm md:text-base font-medium cursor-pointer flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Feature this project (shows first)
                </Label>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="w-full sm:w-auto">
                {editingProject ? "Update" : "Create"} Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-12 md:py-16">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-secondary/10 rounded-full mb-4">
              <FolderGit2 className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-4">
              Click "Add Project" to showcase your work
            </p>
            <Button onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" /> Add Your First Project
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
            >
              {project.image_url && (
                <div className="relative w-full aspect-video overflow-hidden bg-secondary/10">
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-project.jpg';
                    }}
                  />
                  {project.featured && (
                    <div className="absolute top-2 right-2">
                      <Badge className="gap-1 bg-yellow-500/90 text-white border-none">
                        <Star className="h-3 w-3 fill-current" /> Featured
                      </Badge>
                    </div>
                  )}
                </div>
              )}
              <CardHeader className="space-y-1">
                <CardTitle className="text-base md:text-lg font-bold line-clamp-1">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-xs md:text-sm line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.tags.length - 3}
                    </Badge>
                  )}
                  {project.tags.length === 0 && (
                    <span className="text-xs text-muted-foreground">No tags</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.github_url && (
                    <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <FaGithub className="h-3 w-3 mr-1" /> Code
                      </a>
                    </Button>
                  )}
                  {project.live_url && (
                    <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" /> Demo
                      </a>
                    </Button>
                  )}
                  <div className="flex gap-1 ml-auto">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(project)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(project.id)}
                      className="h-8 w-8 p-0 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};