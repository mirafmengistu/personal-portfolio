import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  Save, 
  RefreshCw, 
  Plus, 
  Trash2, 
  GripVertical, 
  Link as LinkIcon,
  ArrowUp,
  ArrowDown,
  Eye,
  Sparkles,
  Code2,
  Copyright
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QuickLink {
  id: string;
  label: string;
  url: string;
}

interface FooterData {
  id: string;
  brand_name: string;
  brand_tagline: string;
  copyright_text: string;
  built_with: string[];
  show_quick_links: boolean;
  show_social_links: boolean;
  show_built_with: boolean;
  quick_links: QuickLink[];
}

export const FooterEditor = () => {
  const [footer, setFooter] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newBuiltWith, setNewBuiltWith] = useState("");
  const [isAddBuiltWithDialogOpen, setIsAddBuiltWithDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkForm, setLinkForm] = useState({ label: "", url: "" });

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('footer_settings')
        .select('*')
        .maybeSingle();
      
      if (error) {
        toast.error("Failed to load footer data: " + error.message);
        setLoading(false);
        return;
      }
      
      if (!data) {
        const defaultData = {
          brand_name: "Portfolio",
          brand_tagline: "Building exceptional digital experiences with modern web technologies.",
          copyright_text: "All rights reserved.",
          built_with: ["Vite", "React", "TypeScript", "Tailwind", "shadcn/ui"],
          show_quick_links: true,
          show_social_links: true,
          show_built_with: true,
          quick_links: [
            { id: "1", label: "Home", url: "#home" },
            { id: "2", label: "Projects", url: "#projects" },
            { id: "3", label: "Skills", url: "#skills" },
            { id: "4", label: "Contact", url: "#contact" },
          ]
        };
        
        const { data: newData, error: insertError } = await supabase
          .from('footer_settings')
          .insert([{
            brand_name: defaultData.brand_name,
            brand_tagline: defaultData.brand_tagline,
            copyright_text: defaultData.copyright_text,
            built_with: defaultData.built_with,
            show_quick_links: defaultData.show_quick_links,
            show_social_links: defaultData.show_social_links,
            show_built_with: defaultData.show_built_with,
            quick_links: defaultData.quick_links,
          }])
          .select()
          .single();
        
        if (newData && !insertError) {
          setFooter({
            ...newData,
            built_with: newData.built_with || [],
            quick_links: newData.quick_links || [],
          });
          toast.info("Default footer data created");
        } else if (insertError) {
          toast.error("Failed to create default data: " + insertError.message);
          setLoading(false);
          return;
        }
      } else {
        let quickLinks = data.quick_links || [];
        if (typeof data.quick_links === 'string') {
          try { quickLinks = JSON.parse(data.quick_links); } catch { quickLinks = []; }
        }
        
        setFooter({
          ...data,
          built_with: data.built_with || [],
          quick_links: quickLinks,
          brand_name: data.brand_name || "Portfolio",
          brand_tagline: data.brand_tagline || "",
          copyright_text: data.copyright_text || "All rights reserved.",
          show_quick_links: data.show_quick_links !== undefined ? data.show_quick_links : true,
          show_social_links: data.show_social_links !== undefined ? data.show_social_links : true,
          show_built_with: data.show_built_with !== undefined ? data.show_built_with : true,
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
    
    setLoading(false);
  };

  const handleSave = async () => {
    if (!footer) {
      toast.error("No data to save");
      return;
    }
    
    setSaving(true);
    
    try {
      const saveData = {
        brand_name: footer.brand_name,
        brand_tagline: footer.brand_tagline,
        copyright_text: footer.copyright_text,
        built_with: footer.built_with,
        show_quick_links: footer.show_quick_links,
        show_social_links: footer.show_social_links,
        show_built_with: footer.show_built_with,
        quick_links: footer.quick_links,
        updated_at: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('footer_settings')
        .update(saveData)
        .eq('id', footer.id)
        .select()
        .single();

      if (error) {
        if (error.message && error.message.includes("column")) {
          toast.error("Database column missing. Please run the SQL migration script.");
        } else {
          toast.error("Failed to save: " + error.message);
        }
      } else {
        toast.success("Footer data saved successfully!");
        if (data) {
          setFooter({
            ...data,
            built_with: data.built_with || [],
            quick_links: data.quick_links || [],
          });
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred while saving");
    }
    
    setSaving(false);
  };

  const handleReset = () => {
    if (confirm("Reset all footer data to default values?")) {
      fetchFooterData();
      toast.info("Footer data reset");
    }
  };

  const handleAddBuiltWith = () => {
    if (newBuiltWith.trim() && footer) {
      setFooter({
        ...footer,
        built_with: [...(footer.built_with || []), newBuiltWith.trim()]
      });
      setNewBuiltWith("");
      setIsAddBuiltWithDialogOpen(false);
      toast.success("Technology added");
    }
  };

  const handleRemoveBuiltWith = (index: number) => {
    if (footer && confirm("Remove this technology?")) {
      const newBuiltWith = (footer.built_with || []).filter((_, i) => i !== index);
      setFooter({ ...footer, built_with: newBuiltWith });
      toast.success("Technology removed");
    }
  };

  const handleMoveBuiltWith = (index: number, direction: 'up' | 'down') => {
    if (!footer) return;
    const newBuiltWith = [...(footer.built_with || [])];
    if (direction === 'up' && index > 0) {
      [newBuiltWith[index - 1], newBuiltWith[index]] = [newBuiltWith[index], newBuiltWith[index - 1]];
    } else if (direction === 'down' && index < newBuiltWith.length - 1) {
      [newBuiltWith[index], newBuiltWith[index + 1]] = [newBuiltWith[index + 1], newBuiltWith[index]];
    }
    setFooter({ ...footer, built_with: newBuiltWith });
  };

  const handleAddQuickLink = () => {
    if (!footer) return;
    const newLink = {
      id: Date.now().toString(),
      label: linkForm.label,
      url: linkForm.url,
    };
    setFooter({
      ...footer,
      quick_links: [...(footer.quick_links || []), newLink]
    });
    setLinkForm({ label: "", url: "" });
    setIsLinkDialogOpen(false);
    toast.success("Quick link added");
  };

  const handleEditQuickLink = (link: QuickLink) => {
    setEditingLink(link);
    setLinkForm({ label: link.label, url: link.url });
    setIsLinkDialogOpen(true);
  };

  const handleUpdateQuickLink = () => {
    if (!footer || !editingLink) return;
    const updatedLinks = (footer.quick_links || []).map(link =>
      link.id === editingLink.id 
        ? { ...link, label: linkForm.label, url: linkForm.url }
        : link
    );
    setFooter({ ...footer, quick_links: updatedLinks });
    setLinkForm({ label: "", url: "" });
    setEditingLink(null);
    setIsLinkDialogOpen(false);
    toast.success("Quick link updated");
  };

  const handleDeleteQuickLink = (id: string) => {
    if (footer && confirm("Delete this quick link?")) {
      const updatedLinks = (footer.quick_links || []).filter(link => link.id !== id);
      setFooter({ ...footer, quick_links: updatedLinks });
      toast.success("Quick link deleted");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Loading footer data...</p>
      </div>
    );
  }

  if (!footer) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load footer data</p>
        <Button onClick={fetchFooterData} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Footer Editor</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Customize your footer section
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" /> Reset
          </Button>
          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Brand Information */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg md:text-xl">Brand Information</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Edit your brand name and tagline
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="brand_name" className="text-sm md:text-base font-medium">
              Brand Name
            </Label>
            <div className="relative">
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="brand_name"
                value={footer.brand_name || ""}
                onChange={(e) => setFooter({ ...footer, brand_name: e.target.value })}
                placeholder="Your Brand Name"
                className="pl-10 h-10 md:h-11 text-base"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand_tagline" className="text-sm md:text-base font-medium">
              Brand Tagline
            </Label>
            <Textarea
              id="brand_tagline"
              value={footer.brand_tagline || ""}
              onChange={(e) => setFooter({ ...footer, brand_tagline: e.target.value })}
              placeholder="Your brand tagline or description"
              rows={2}
              className="min-h-[60px] md:min-h-[70px] text-base resize-y"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="copyright_text" className="text-sm md:text-base font-medium">
              Copyright Text
            </Label>
            <div className="relative">
              <Copyright className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="copyright_text"
                value={footer.copyright_text || ""}
                onChange={(e) => setFooter({ ...footer, copyright_text: e.target.value })}
                placeholder="All rights reserved."
                className="pl-10 h-10 md:h-11 text-base"
              />
            </div>
            <p className="text-xs text-muted-foreground">The year will be added automatically</p>
          </div>
        </CardContent>
      </Card>

      {/* Built With Section */}
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg md:text-xl">Built With Technologies</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Technologies and tools you used to build this portfolio
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAddBuiltWithDialogOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-3 w-3 mr-1" /> Add Technology
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-secondary/10 rounded-lg">
            <div>
              <Label className="text-sm md:text-base font-medium">Show Built With Section</Label>
              <p className="text-xs text-muted-foreground">Display technologies used in footer</p>
            </div>
            <Switch
              id="show_built_with"
              checked={footer.show_built_with || false}
              onCheckedChange={(checked) => setFooter({ ...footer, show_built_with: checked })}
              className="flex-shrink-0"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(footer.built_with || []).map((tech, index) => (
              <div 
                key={index} 
                className="flex items-center gap-1 md:gap-2 bg-secondary/10 rounded-lg px-2 md:px-3 py-1.5 border border-border"
              >
                <GripVertical className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <span className="text-xs md:text-sm">{tech}</span>
                <div className="flex items-center gap-0.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleMoveBuiltWith(index, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleMoveBuiltWith(index, 'down')}
                    disabled={index === (footer.built_with || []).length - 1}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:text-red-500"
                    onClick={() => handleRemoveBuiltWith(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            {(!footer.built_with || footer.built_with.length === 0) && (
              <div className="w-full text-center py-6">
                <Code2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No technologies added.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsAddBuiltWithDialogOpen(true)}
                  className="mt-2"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Your First Technology
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links Section */}
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg md:text-xl">Quick Links</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Navigation links for your footer
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setEditingLink(null);
                setLinkForm({ label: "", url: "" });
                setIsLinkDialogOpen(true);
              }}
              className="w-full sm:w-auto"
            >
              <Plus className="h-3 w-3 mr-1" /> Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-secondary/10 rounded-lg">
            <div>
              <Label className="text-sm md:text-base font-medium">Show Quick Links</Label>
              <p className="text-xs text-muted-foreground">Display navigation links in footer</p>
            </div>
            <Switch
              id="show_quick_links"
              checked={footer.show_quick_links || false}
              onCheckedChange={(checked) => setFooter({ ...footer, show_quick_links: checked })}
              className="flex-shrink-0"
            />
          </div>

          <div className="space-y-2">
            {(footer.quick_links || []).map((link) => (
              <div 
                key={link.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-secondary/10 rounded-lg border border-border"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm md:text-base font-medium truncate">{link.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                  </div>
                </div>
                <div className="flex gap-1 self-end sm:self-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditQuickLink(link)}
                    className="h-8 px-2 text-xs"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteQuickLink(link.id)}
                    className="h-8 w-8 p-0 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {(!footer.quick_links || footer.quick_links.length === 0) && (
              <div className="text-center py-6">
                <LinkIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No quick links added.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setEditingLink(null);
                    setLinkForm({ label: "", url: "" });
                    setIsLinkDialogOpen(true);
                  }}
                  className="mt-2"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Your First Link
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Social Links Toggle */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg md:text-xl">Social Links</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Show or hide social media links in footer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-secondary/10 rounded-lg">
            <div>
              <Label className="text-sm md:text-base font-medium">Show Social Links</Label>
              <p className="text-xs text-muted-foreground">Display social media icons in footer</p>
            </div>
            <Switch
              id="show_social_links"
              checked={footer.show_social_links || false}
              onCheckedChange={(checked) => setFooter({ ...footer, show_social_links: checked })}
              className="flex-shrink-0"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Note: Social links are managed in the Profile Editor
          </p>
        </CardContent>
      </Card>

      {/* Live Preview */}
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg md:text-xl">Live Preview</CardTitle>
          </div>
          <CardDescription className="text-sm md:text-base">
            How your footer will appear on your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 md:p-6 bg-card border rounded-lg space-y-4 md:space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg md:text-xl font-bold">{footer.brand_name}</h3>
              {footer.brand_tagline && (
                <p className="text-sm md:text-base text-muted-foreground">{footer.brand_tagline}</p>
              )}
            </div>

            {(footer.show_quick_links && footer.quick_links && footer.quick_links.length > 0) && (
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {(footer.quick_links || []).slice(0, 4).map((link) => (
                  <a 
                    key={link.id} 
                    href="#" 
                    className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}

            {(footer.show_built_with && footer.built_with && footer.built_with.length > 0) && (
              <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
                {(footer.built_with || []).slice(0, 6).map((tech, idx) => (
                  <span 
                    key={idx} 
                    className="text-[10px] md:text-xs px-2 md:px-3 py-1 bg-secondary rounded-md"
                  >
                    {tech}
                  </span>
                ))}
                {(footer.built_with || []).length > 6 && (
                  <span className="text-[10px] md:text-xs px-2 md:px-3 py-1 bg-secondary rounded-md">
                    +{(footer.built_with || []).length - 6}
                  </span>
                )}
              </div>
            )}

            <div className="text-center text-xs md:text-sm text-muted-foreground pt-2 border-t border-border">
              © {new Date().getFullYear()} {footer.brand_name}. {footer.copyright_text}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Built With Dialog */}
      <Dialog open={isAddBuiltWithDialogOpen} onOpenChange={setIsAddBuiltWithDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl md:text-2xl">Add Technology</DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              Add a technology or tool you used to build this portfolio
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="technology" className="text-sm md:text-base font-medium">
                Technology name
              </Label>
              <Input
                id="technology"
                value={newBuiltWith}
                onChange={(e) => setNewBuiltWith(e.target.value)}
                placeholder="e.g., Vite, React, Tailwind"
                onKeyPress={(e) => e.key === 'Enter' && handleAddBuiltWith()}
                className="h-10 md:h-11 text-base"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddBuiltWithDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleAddBuiltWith} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> Add Technology
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Link Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl md:text-2xl">
              {editingLink ? "Edit Quick Link" : "Add Quick Link"}
            </DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              {editingLink ? "Update the link details" : "Add a new navigation link to your footer"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 md:space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="link-label" className="text-sm md:text-base font-medium">
                Link Label
              </Label>
              <Input
                id="link-label"
                value={linkForm.label}
                onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })}
                placeholder="e.g., Home, Projects, Contact"
                className="h-10 md:h-11 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-url" className="text-sm md:text-base font-medium">
                Link URL
              </Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="link-url"
                  value={linkForm.url}
                  onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                  placeholder="#home, #projects, /about"
                  className="pl-10 h-10 md:h-11 text-base"
                />
              </div>
              <p className="text-xs text-muted-foreground">Use #section-id for same-page links</p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={editingLink ? handleUpdateQuickLink : handleAddQuickLink} className="w-full sm:w-auto">
              {editingLink ? "Update Link" : "Add Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};