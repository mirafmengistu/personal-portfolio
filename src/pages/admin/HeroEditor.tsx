import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  Save, 
  RefreshCw, 
  Plus, 
  Trash2, 
  GripVertical,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Eye,
  Link2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HeroData {
  id: string;
  greeting: string;
  animated_texts: string[];
  primary_cta: string;
  secondary_cta: string;
  primary_cta_link: string;
  secondary_cta_link: string;
  show_social_links: boolean;
  enable_animated_text: boolean;
}

export const HeroEditor = () => {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newAnimatedText, setNewAnimatedText] = useState("");
  const [isAddTextDialogOpen, setIsAddTextDialogOpen] = useState(false);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('hero_section')
      .select('*')
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching hero data:", error);
      toast.error("Failed to load hero data");
    } else if (!data) {
      const { data: newData, error: insertError } = await supabase
        .from('hero_section')
        .insert([{
          greeting: "Hi, I'm",
          animated_texts: ["Full Stack Developer", "UI/UX Enthusiast", "Problem Solver"],
          primary_cta: "View Projects",
          secondary_cta: "Contact Me",
          primary_cta_link: "#projects",
          secondary_cta_link: "#contact",
          show_social_links: true,
          enable_animated_text: true,
        }])
        .select()
        .single();
      
      if (newData && !insertError) {
        setHero(newData);
        toast.info("Default hero data created");
      } else if (insertError) {
        console.error("Error creating default hero:", insertError);
      }
    } else {
      setHero(data);
    }
    
    setLoading(false);
  };

  const handleSave = async () => {
    if (!hero) return;
    setSaving(true);
    
    const { error } = await supabase
      .from('hero_section')
      .update({
        greeting: hero.greeting,
        animated_texts: hero.animated_texts,
        primary_cta: hero.primary_cta,
        secondary_cta: hero.secondary_cta,
        primary_cta_link: hero.primary_cta_link,
        secondary_cta_link: hero.secondary_cta_link,
        show_social_links: hero.show_social_links,
        enable_animated_text: hero.enable_animated_text,
        updated_at: new Date(),
      })
      .eq('id', hero.id);

    if (error) {
      console.error("Error saving hero:", error);
      toast.error("Failed to save hero data: " + error.message);
    } else {
      toast.success("Hero data saved successfully!");
    }
    setSaving(false);
  };

  const handleReset = () => {
    if (confirm("Reset all hero data to default values?")) {
      fetchHeroData();
      toast.info("Hero data reset");
    }
  };

  const handleAddAnimatedText = () => {
    if (newAnimatedText.trim() && hero) {
      setHero({
        ...hero,
        animated_texts: [...hero.animated_texts, newAnimatedText.trim()]
      });
      setNewAnimatedText("");
      setIsAddTextDialogOpen(false);
      toast.success("Animated text added");
    }
  };

  const handleRemoveAnimatedText = (index: number) => {
    if (hero && confirm("Remove this animated text?")) {
      const newTexts = hero.animated_texts.filter((_, i) => i !== index);
      setHero({ ...hero, animated_texts: newTexts });
      toast.success("Animated text removed");
    }
  };

  const handleMoveText = (index: number, direction: 'up' | 'down') => {
    if (!hero) return;
    const newTexts = [...hero.animated_texts];
    if (direction === 'up' && index > 0) {
      [newTexts[index - 1], newTexts[index]] = [newTexts[index], newTexts[index - 1]];
    } else if (direction === 'down' && index < newTexts.length - 1) {
      [newTexts[index], newTexts[index + 1]] = [newTexts[index + 1], newTexts[index]];
    }
    setHero({ ...hero, animated_texts: newTexts });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Loading hero data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Hero Section Editor</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Customize your main hero section content
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

      {/* Main Hero Content */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg md:text-xl">Hero Content</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Edit the main text and buttons on your hero section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="greeting" className="text-sm md:text-base font-medium">
              Greeting Text
            </Label>
            <div className="relative">
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="greeting"
                value={hero?.greeting || ""}
                onChange={(e) => setHero({ ...hero!, greeting: e.target.value })}
                placeholder="Hi, I'm"
                className="pl-10 h-10 md:h-11 text-base"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Shown before your name (your name comes from Profile Editor)
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <Label className="text-sm md:text-base font-medium">Animated Text Rotator</Label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAddTextDialogOpen(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Text
              </Button>
            </div>
            <div className="space-y-2">
              {hero?.animated_texts?.map((text, index) => (
                <div 
                  key={index} 
                  className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-secondary/10 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm md:text-base truncate">{text}</span>
                  </div>
                  <div className="flex gap-1 self-end sm:self-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveText(index, 'up')}
                      disabled={index === 0}
                      className="h-8 w-8 p-0"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveText(index, 'down')}
                      disabled={index === (hero?.animated_texts?.length || 0) - 1}
                      className="h-8 w-8 p-0"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAnimatedText(index)}
                      className="h-8 w-8 p-0 hover:text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {(!hero?.animated_texts || hero.animated_texts.length === 0) && (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">No animated texts added.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsAddTextDialogOpen(true)}
                    className="mt-2"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Your First Text
                  </Button>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              These texts will rotate automatically in your hero section
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-secondary/10 rounded-lg">
            <div>
              <Label className="text-sm md:text-base font-medium">Enable Animated Text</Label>
              <p className="text-xs text-muted-foreground">Show rotating text animation</p>
            </div>
            <Switch
              id="enable_animated_text"
              checked={hero?.enable_animated_text || false}
              onCheckedChange={(checked) => setHero({ ...hero!, enable_animated_text: checked })}
              className="flex-shrink-0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Call to Action Buttons */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg md:text-xl">Call to Action Buttons</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Customize the buttons and their links
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary_cta" className="text-sm md:text-base font-medium">
                Primary Button Text
              </Label>
              <Input
                id="primary_cta"
                value={hero?.primary_cta || ""}
                onChange={(e) => setHero({ ...hero!, primary_cta: e.target.value })}
                placeholder="View Projects"
                className="h-10 md:h-11 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary_cta_link" className="text-sm md:text-base font-medium">
                Primary Button Link
              </Label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="primary_cta_link"
                  value={hero?.primary_cta_link || ""}
                  onChange={(e) => setHero({ ...hero!, primary_cta_link: e.target.value })}
                  placeholder="#projects"
                  className="pl-10 h-10 md:h-11 text-base"
                />
              </div>
              <p className="text-xs text-muted-foreground">Use #section-id for internal links</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="secondary_cta" className="text-sm md:text-base font-medium">
                Secondary Button Text
              </Label>
              <Input
                id="secondary_cta"
                value={hero?.secondary_cta || ""}
                onChange={(e) => setHero({ ...hero!, secondary_cta: e.target.value })}
                placeholder="Contact Me"
                className="h-10 md:h-11 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary_cta_link" className="text-sm md:text-base font-medium">
                Secondary Button Link
              </Label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="secondary_cta_link"
                  value={hero?.secondary_cta_link || ""}
                  onChange={(e) => setHero({ ...hero!, secondary_cta_link: e.target.value })}
                  placeholder="#contact"
                  className="pl-10 h-10 md:h-11 text-base"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-secondary/10 rounded-lg">
            <div>
              <Label className="text-sm md:text-base font-medium">Show Social Links</Label>
              <p className="text-xs text-muted-foreground">Display social media icons on hero section</p>
            </div>
            <Switch
              id="show_social_links"
              checked={hero?.show_social_links || false}
              onCheckedChange={(checked) => setHero({ ...hero!, show_social_links: checked })}
              className="flex-shrink-0"
            />
          </div>
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
            See how your hero section will look on your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 md:p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg text-center space-y-4 md:space-y-6 border border-border">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                {hero?.greeting} Your Name
              </h2>
              {hero?.enable_animated_text && hero.animated_texts && hero.animated_texts.length > 0 && (
                <p className="text-lg md:text-xl text-muted-foreground">
                  {hero.animated_texts[0]}
                  <span className="inline-block w-0.5 h-5 md:h-6 bg-primary animate-pulse ml-1"></span>
                </p>
              )}
              {(!hero?.enable_animated_text || !hero?.animated_texts?.length) && (
                <p className="text-lg md:text-xl text-muted-foreground">
                  Static Text Example
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button className="w-full sm:w-auto">
                {hero?.primary_cta || "View Projects"}
              </Button>
              <Button variant="outline" className="w-full sm:w-auto">
                {hero?.secondary_cta || "Contact Me"}
              </Button>
            </div>
            {hero?.show_social_links && (
              <div className="flex gap-4 justify-center pt-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-muted animate-pulse"></div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Animated Text Dialog */}
      <Dialog open={isAddTextDialogOpen} onOpenChange={setIsAddTextDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl md:text-2xl">Add Animated Text</DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              Add a new text that will rotate in your hero section
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="animated-text" className="text-sm md:text-base font-medium">
                Text to display
              </Label>
              <Input
                id="animated-text"
                value={newAnimatedText}
                onChange={(e) => setNewAnimatedText(e.target.value)}
                placeholder="e.g., Software Engineer, Designer, Creator"
                onKeyPress={(e) => e.key === 'Enter' && handleAddAnimatedText()}
                className="h-10 md:h-11 text-base"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddTextDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleAddAnimatedText} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> Add Text
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};