import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Save, 
  RefreshCw,
  CheckCircle2,
  Eye
} from "lucide-react";

interface ContactData {
  id: string;
  email: string;
  phone: string;
  location: string;
  availability: string;
  contact_form_enabled: boolean;
  success_message: string;
}

export const ContactEditor = () => {
  const [contact, setContact] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .maybeSingle();
    
    if (error) {
      toast.error("Failed to load contact data");
    } else if (!data) {
      // Create default contact data if none exists
      const { data: newData, error: insertError } = await supabase
        .from('contact_info')
        .insert([{
          email: "your.email@example.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          availability: "Available for freelance work and full-time opportunities",
          contact_form_enabled: true,
          success_message: "Thanks for reaching out! I'll get back to you within 24 hours."
        }])
        .select()
        .single();
      
      if (newData && !insertError) {
        setContact(newData);
        toast.info("Default contact data created");
      }
    } else {
      setContact(data);
    }
    
    setLoading(false);
  };

  const handleSave = async () => {
    if (!contact) return;
    setSaving(true);
    
    const { error } = await supabase
      .from('contact_info')
      .update({
        email: contact.email,
        phone: contact.phone,
        location: contact.location,
        availability: contact.availability,
        contact_form_enabled: contact.contact_form_enabled,
        success_message: contact.success_message,
        updated_at: new Date(),
      })
      .eq('id', contact.id);

    if (error) {
      toast.error("Failed to save contact data");
    } else {
      toast.success("Contact data saved successfully!");
    }
    setSaving(false);
  };

  const handleReset = () => {
    if (confirm("Reset all contact data to default values?")) {
      fetchContactData();
      toast.info("Contact data reset");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Loading contact data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Contact Editor</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Manage your contact information and form settings
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

      {/* Contact Information */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg md:text-xl">Contact Information</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Update your contact details that appear on your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm md:text-base font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                value={contact?.email || ""}
                onChange={(e) => setContact({ ...contact!, email: e.target.value })}
                placeholder="your.email@example.com"
                className="pl-10 h-10 md:h-11 text-base"
              />
            </div>
            <p className="text-xs text-muted-foreground">This email will receive messages from the contact form</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm md:text-base font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" /> Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="phone"
                value={contact?.phone || ""}
                onChange={(e) => setContact({ ...contact!, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="pl-10 h-10 md:h-11 text-base"
              />
            </div>
            <p className="text-xs text-muted-foreground">Optional - leave empty to hide phone number</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm md:text-base font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="location"
                value={contact?.location || ""}
                onChange={(e) => setContact({ ...contact!, location: e.target.value })}
                placeholder="City, Country"
                className="pl-10 h-10 md:h-11 text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability" className="text-sm md:text-base font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" /> Availability Status
            </Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Textarea
                id="availability"
                value={contact?.availability || ""}
                onChange={(e) => setContact({ ...contact!, availability: e.target.value })}
                placeholder="e.g., Available for freelance work"
                rows={2}
                className="pl-10 min-h-[60px] md:min-h-[70px] text-base resize-y"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Form Settings */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg md:text-xl">Contact Form Settings</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Configure how your contact form behaves
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-secondary/10 rounded-lg">
            <div>
              <Label htmlFor="contact_form_enabled" className="text-sm md:text-base font-medium">
                Enable Contact Form
              </Label>
              <p className="text-xs text-muted-foreground">Show/hide the contact form on your portfolio</p>
            </div>
            <Switch
              id="contact_form_enabled"
              checked={contact?.contact_form_enabled || false}
              onCheckedChange={(checked) => setContact({ ...contact!, contact_form_enabled: checked })}
              className="flex-shrink-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="success_message" className="text-sm md:text-base font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Success Message
            </Label>
            <Textarea
              id="success_message"
              value={contact?.success_message || ""}
              onChange={(e) => setContact({ ...contact!, success_message: e.target.value })}
              placeholder="Thank you for your message!"
              rows={3}
              className="min-h-[80px] md:min-h-[100px] text-base resize-y"
            />
            <p className="text-xs text-muted-foreground">Message shown after successful form submission</p>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg md:text-xl">Preview</CardTitle>
          </div>
          <CardDescription className="text-sm md:text-base">
            How your contact info will appear on your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-4 md:p-6 bg-secondary/10 rounded-lg border border-border">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm md:text-base font-medium truncate">
                  {contact?.email || "Not set"}
                </p>
              </div>
            </div>
            
            {contact?.phone && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm md:text-base font-medium truncate">
                    {contact.phone}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm md:text-base font-medium truncate">
                  {contact?.location || "Not set"}
                </p>
              </div>
            </div>

            {contact?.availability && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Availability</p>
                  <p className="text-sm md:text-base font-medium">
                    {contact.availability}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};