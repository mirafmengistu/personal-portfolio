import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  Plus, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  Layers,
  Tag
} from "lucide-react";
import { IconSelector, iconOptions } from "@/components/admin/IconSelector";
import { ColorSelector } from "@/components/admin/ColorSelector";
import type { SkillCategory, Skill } from "@/types/admin";

export const SkillsManager = () => {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    icon: "Layout",
    color: "from-blue-500 to-cyan-500",
    display_order: 0,
  });
  
  const [skillForm, setSkillForm] = useState({
    name: "",
    proficiency: 80,
    display_order: 0,
    category_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('skill_categories')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (categoriesError) {
      toast.error("Failed to load categories");
    } else {
      setCategories(categoriesData || []);
    }
    
    const { data: skillsData, error: skillsError } = await supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (skillsError) {
      toast.error("Failed to load skills");
    } else {
      setSkills(skillsData || []);
    }
    
    setLoading(false);
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategorySubmit = async () => {
    if (!categoryForm.name) {
      toast.error("Category name is required");
      return;
    }

    if (editingCategory) {
      const { error } = await supabase
        .from('skill_categories')
        .update({
          name: categoryForm.name,
          icon: categoryForm.icon,
          color: categoryForm.color,
          display_order: categoryForm.display_order,
        })
        .eq('id', editingCategory.id);

      if (error) {
        toast.error("Failed to update category");
      } else {
        toast.success("Category updated successfully!");
        fetchData();
        resetCategoryForm();
        setIsCategoryDialogOpen(false);
      }
    } else {
      const { error } = await supabase
        .from('skill_categories')
        .insert([{
          name: categoryForm.name,
          icon: categoryForm.icon,
          color: categoryForm.color,
          display_order: categoryForm.display_order,
        }]);

      if (error) {
        toast.error("Failed to create category");
      } else {
        toast.success("Category created successfully!");
        fetchData();
        resetCategoryForm();
        setIsCategoryDialogOpen(false);
      }
    }
  };

  const handleSkillSubmit = async () => {
    if (!skillForm.name || !skillForm.category_id) {
      toast.error("Skill name and category are required");
      return;
    }

    if (editingSkill) {
      const { error } = await supabase
        .from('skills')
        .update({
          name: skillForm.name,
          proficiency: skillForm.proficiency,
          display_order: skillForm.display_order,
          category_id: skillForm.category_id,
        })
        .eq('id', editingSkill.id);

      if (error) {
        toast.error("Failed to update skill: " + error.message);
      } else {
        toast.success("Skill updated successfully!");
        fetchData();
        resetSkillForm();
        setIsSkillDialogOpen(false);
      }
    } else {
      const { error } = await supabase
        .from('skills')
        .insert([{
          name: skillForm.name,
          proficiency: skillForm.proficiency,
          display_order: skillForm.display_order,
          category_id: skillForm.category_id,
        }]);

      if (error) {
        toast.error("Failed to create skill: " + error.message);
      } else {
        toast.success("Skill created successfully!");
        fetchData();
        resetSkillForm();
        setIsSkillDialogOpen(false);
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Are you sure? This will delete all skills in this category as well.")) {
      const { error } = await supabase
        .from('skill_categories')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error("Failed to delete category");
      } else {
        toast.success("Category deleted successfully!");
        fetchData();
      }
    }
  };

  const handleDeleteSkill = async (id: string, skillName: string) => {
    if (confirm(`Are you sure you want to delete "${skillName}"?`)) {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error("Failed to delete skill: " + error.message);
      } else {
        toast.success(`"${skillName}" deleted successfully!`);
        fetchData();
      }
    }
  };

  const handleEditCategory = (category: SkillCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      icon: category.icon,
      color: category.color,
      display_order: category.display_order,
    });
    setIsCategoryDialogOpen(true);
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillForm({
      name: skill.name,
      proficiency: skill.proficiency,
      display_order: skill.display_order,
      category_id: skill.category_id,
    });
    setSelectedCategoryId(skill.category_id);
    setIsSkillDialogOpen(true);
  };

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: "",
      icon: "Layout",
      color: "from-blue-500 to-cyan-500",
      display_order: categories.length,
    });
  };

  const resetSkillForm = () => {
    setEditingSkill(null);
    setSkillForm({
      name: "",
      proficiency: 80,
      display_order: 0,
      category_id: selectedCategoryId,
    });
  };

  const getSkillsByCategory = (categoryId: string) => {
    return skills.filter(skill => skill.category_id === categoryId);
  };

  const openAddSkillDialog = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSkillForm({
      name: "",
      proficiency: 80,
      display_order: 0,
      category_id: categoryId,
    });
    setEditingSkill(null);
    setIsSkillDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Loading skills...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Skills Manager</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Manage your skills and categories
          </p>
        </div>
        <Button 
          onClick={() => {
            resetCategoryForm();
            setIsCategoryDialogOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* Categories and Skills Display */}
      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-secondary/10 rounded-full mb-4">
                <Layers className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">No categories yet</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Create a category to start adding skills
              </p>
              <Button onClick={() => {
                resetCategoryForm();
                setIsCategoryDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" /> Add Your First Category
              </Button>
            </div>
          </div>
        ) : (
          categories.map((category) => {
            const categorySkills = getSkillsByCategory(category.id);
            const isExpanded = expandedCategories.has(category.id);
            const selectedIcon = iconOptions.find(opt => opt.value === category.icon);
            const IconComponent = selectedIcon?.icon;
            
            return (
              <Card key={category.id} className="overflow-hidden">
                <CardHeader 
                  className="cursor-pointer hover:bg-secondary/50 transition-colors p-4 md:p-6"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} bg-opacity-10 flex-shrink-0`}>
                        {IconComponent ? (
                          <IconComponent className="h-5 w-5 text-primary" />
                        ) : (
                          <Layers className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base md:text-lg truncate">
                          {category.name}
                        </CardTitle>
                        <CardDescription className="text-xs md:text-sm">
                          {categorySkills.length} skill{categorySkills.length !== 1 ? 's' : ''}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0 self-start sm:self-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openAddSkillDialog(category.id);
                        }}
                        className="h-8 md:h-9 text-xs md:text-sm"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Skill
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCategory(category);
                        }}
                        className="h-8 w-8 md:h-9 md:w-9 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.id);
                        }}
                        className="h-8 w-8 md:h-9 md:w-9 p-0 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent className="pt-0 p-4 md:p-6">
                    {categorySkills.length === 0 ? (
                      <div className="text-center py-6 md:py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Tag className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">No skills yet</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openAddSkillDialog(category.id)}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add Skill
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {categorySkills.map((skill) => (
                          <Badge 
                            key={skill.id} 
                            variant="secondary" 
                            className="text-xs md:text-sm py-1.5 md:py-2 px-2 md:px-3 gap-1 md:gap-2 group flex items-center"
                          >
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-xs text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded">
                              {skill.proficiency}%
                            </span>
                            <div className="flex items-center gap-0.5 ml-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditSkill(skill);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-accent rounded"
                              >
                                <Edit className="h-3 w-3 cursor-pointer hover:text-primary" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSkill(skill.id, skill.name);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-accent rounded"
                              >
                                <Trash2 className="h-3 w-3 cursor-pointer hover:text-red-500" />
                              </button>
                            </div>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl md:text-2xl">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              Create a skill category (e.g., Frontend, Backend)
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 md:space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name" className="text-sm md:text-base font-medium">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category-name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="e.g., Frontend Development"
                className="h-10 md:h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm md:text-base font-medium">Icon</Label>
              <IconSelector 
                value={categoryForm.icon} 
                onChange={(value) => setCategoryForm({ ...categoryForm, icon: value })} 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm md:text-base font-medium">Color Gradient</Label>
              <ColorSelector 
                value={categoryForm.color} 
                onChange={(value) => setCategoryForm({ ...categoryForm, color: value })} 
              />
              <div className={`h-10 rounded-lg bg-gradient-to-r ${categoryForm.color} mt-2`} />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleCategorySubmit} className="w-full sm:w-auto">
              {editingCategory ? "Update" : "Create"} Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Skill Dialog */}
      <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl md:text-2xl">
              {editingSkill ? "Edit Skill" : "Add New Skill"}
            </DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              {editingSkill ? "Update the skill details" : "Add a skill to a category"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 md:space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-sm md:text-base font-medium">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={skillForm.category_id}
                onValueChange={(value) => setSkillForm({ ...skillForm, category_id: value })}
              >
                <SelectTrigger className="h-10 md:h-11 text-base">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill-name" className="text-sm md:text-base font-medium">
                Skill Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="skill-name"
                value={skillForm.name}
                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                placeholder="e.g., React, Python, AWS"
                className="h-10 md:h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm md:text-base font-medium">Proficiency (%)</Label>
              <Select
                value={skillForm.proficiency.toString()}
                onValueChange={(value) => setSkillForm({ ...skillForm, proficiency: parseInt(value) })}
              >
                <SelectTrigger className="h-10 md:h-11 text-base">
                  <SelectValue placeholder="Select proficiency" />
                </SelectTrigger>
                <SelectContent>
                  {[20, 30, 40, 50, 60, 70, 75, 80, 85, 90, 95, 100].map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      <div className="flex items-center gap-2 w-full">
                        <span className="w-10 md:w-12 text-sm">{level}%</span>
                        <div className="flex-1 h-2 bg-secondary rounded overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded transition-all" 
                            style={{ width: `${level}%` }}
                          />
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsSkillDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSkillSubmit} className="w-full sm:w-auto">
              {editingSkill ? "Update" : "Create"} Skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};