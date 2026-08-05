import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  User, 
  Briefcase, 
  FileUser,
  Mail,
  Globe,
  Save,
  Image as ImageIcon,
  Camera
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import type { Profile, SocialLink } from "@/types/admin";

export const ProfileEditor = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch profile
    const { data: profileData, error: profileError } = await supabase
      .from('profile')
      .select('*')
      .maybeSingle();
    
    if (!profileData && profileError) {
      const { data: newProfile, error: insertError } = await supabase
        .from('profile')
        .insert([{ 
          name: 'Your Name', 
          title: 'Full Stack Developer', 
          bio: 'Building exceptional digital experiences with modern web technologies.' 
        }])
        .select()
        .single();
      
      if (newProfile && !insertError) {
        setProfile(newProfile);
        toast.info("Default profile created");
      }
    } else if (profileData) {
      setProfile(profileData);
    }
    
    // Fetch social links
    const { data: socialData } = await supabase
      .from('social_links')
      .select('*');
    
    if (socialData && socialData.length === 0) {
      const { data: newSocialData } = await supabase
        .from('social_links')
        .insert([
          { platform: 'github', url: 'https://github.com/yourusername' },
          { platform: 'linkedin', url: 'https://linkedin.com/in/yourusername' },
          { platform: 'email', url: 'mailto:your.email@example.com' },
        ])
        .select();
      
      if (newSocialData) {
        setSocialLinks(newSocialData);
        toast.info("Default social links created");
      }
    } else if (socialData) {
      setSocialLinks(socialData);
    }
    
    setLoading(false);
  };

  const handleProfileUpdate = async () => {
    if (!profile) return;
    setSaving(true);
    
    const { error } = await supabase
      .from('profile')
      .update({
        name: profile.name,
        title: profile.title,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        updated_at: new Date(),
      })
      .eq('id', profile.id);

    if (error) {
      toast.error("Failed to update profile: " + error.message);
    } else {
      toast.success("Profile updated successfully!");
    }
    setSaving(false);
  };

  const handleSocialUpdate = async (id: string | undefined, url: string) => {
    if (!id) return;
    const { error } = await supabase
      .from('social_links')
      .update({ url })
      .eq('id', id);

    if (error) {
      toast.error("Failed to update social link");
    } else {
      toast.success("Social link updated!");
    }
  };

  // ========== AVATAR UPLOAD ==========
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file (JPG, PNG, WebP...)");
      return;
    }

    // Max 3MB
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image too large. Max size 3MB");
      return;
    }

    setUploadingAvatar(true);

    try {
      // Optional: delete old avatar if exists
      if (profile.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage.from('avatars').remove([oldFileName]);
        }
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `avatar_${profile.id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profile')
        .update({
          avatar_url: publicUrlData.publicUrl,
          updated_at: new Date(),
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setProfile({
        ...profile,
        avatar_url: publicUrlData.publicUrl,
      });

      toast.success("Profile photo updated!");
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Failed to upload profile photo");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!profile?.avatar_url) return;
    if (!confirm("Are you sure you want to remove your profile photo?")) return;

    try {
      const fileName = profile.avatar_url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('avatars').remove([fileName]);
      }

      const { error } = await supabase
        .from('profile')
        .update({
          avatar_url: null,
          updated_at: new Date(),
        })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({
        ...profile,
        avatar_url: null,
      });

      toast.success("Profile photo removed");
    } catch (error) {
      console.error("Delete avatar error:", error);
      toast.error("Failed to remove profile photo");
    }
  };

  // ========== RESUME UPLOAD ==========
  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    if (file.type !== 'application/pdf') {
      toast.error("Please upload a PDF file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max size 5MB");
      return;
    }

    setUploadingResume(true);

    try {
      const fileName = `resume_${profile.id}_${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profile')
        .update({
          resume_url: publicUrlData.publicUrl,
          resume_name: file.name,
          updated_at: new Date(),
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setProfile({
        ...profile,
        resume_url: publicUrlData.publicUrl,
        resume_name: file.name,
      });

      toast.success("Resume uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!profile?.resume_url) return;
    if (!confirm("Are you sure you want to delete your resume?")) return;

    try {
      const fileName = profile.resume_url.split('/').pop();
      
      if (fileName) {
        await supabase.storage
          .from('resumes')
          .remove([fileName]);
      }

      const { error } = await supabase
        .from('profile')
        .update({
          resume_url: null,
          resume_name: null,
          updated_at: new Date(),
        })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({
        ...profile,
        resume_url: null,
        resume_name: null,
      });

      toast.success("Resume deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete resume");
    }
  };

  const getSocialIcon = (platform: string) => {
    const icons: Record<string, any> = {
      github: FaGithub,
      linkedin: FaLinkedin,
      email: Mail,
      twitter: Globe,
      website: Globe,
    };
    return icons[platform] || Globe;
  };

  const getSocialPlaceholder = (platform: string) => {
    const placeholders: Record<string, string> = {
      github: 'https://github.com/username',
      linkedin: 'https://linkedin.com/in/username',
      email: 'mailto:your@email.com',
      twitter: 'https://twitter.com/username',
      website: 'https://yourwebsite.com',
    };
    return placeholders[platform] || `Enter your ${platform} URL`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Manage your personal information and online presence
          </p>
        </div>
        <Button 
          onClick={handleProfileUpdate} 
          disabled={saving}
          className="w-full sm:w-auto"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* ========== PROFILE PHOTO ========== */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg md:text-xl">Profile Photo</CardTitle>
          <CardDescription className="text-sm md:text-base">
            This photo appears in your Hero section (recommended: square image, max 3MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profile?.avatar_url ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-border shadow-md"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <Button variant="outline" asChild className="w-full sm:w-auto">
                    <span>
                      <Camera className="h-4 w-4 mr-2" />
                      {uploadingAvatar ? "Uploading..." : "Change Photo"}
                    </span>
                  </Button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                  />
                </Label>
                <Button 
                  variant="outline" 
                  onClick={handleDeleteAvatar}
                  className="w-full sm:w-auto text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-lg p-6 md:p-8 text-center">
              <div className="flex flex-col items-center">
                <div className="p-3 bg-secondary/10 rounded-full mb-4">
                  <ImageIcon className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-sm md:text-base mb-1">No profile photo</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-4">
                  Upload a clear photo of yourself
                </p>
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <Button variant="outline" asChild className="w-full sm:w-auto">
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingAvatar ? "Uploading..." : "Upload Photo"}
                    </span>
                  </Button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                  />
                </Label>
                {uploadingAvatar && (
                  <div className="flex items-center gap-2 mt-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg md:text-xl">Personal Information</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Update your name, title, and bio that appear on your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm md:text-base font-medium">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="name"
                value={profile?.name || ""}
                onChange={(e) => setProfile({ ...profile!, name: e.target.value })}
                placeholder="Your full name"
                className="pl-10 h-10 md:h-11 text-base"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm md:text-base font-medium">Professional Title</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="title"
                value={profile?.title || ""}
                onChange={(e) => setProfile({ ...profile!, title: e.target.value })}
                placeholder="e.g., Full Stack Developer"
                className="pl-10 h-10 md:h-11 text-base"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm md:text-base font-medium">Bio / About Me</Label>
            <Textarea
              id="bio"
              rows={4}
              value={profile?.bio || ""}
              onChange={(e) => setProfile({ ...profile!, bio: e.target.value })}
              placeholder="Tell visitors about yourself..."
              className="min-h-[100px] md:min-h-[150px] text-base resize-y"
            />
          </div>
        </CardContent>
      </Card>

      {/* Resume Upload Section */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg md:text-xl">Resume / CV</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Upload your resume for visitors to download (PDF only, max 5MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profile?.resume_url ? (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-secondary/10 rounded-lg gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm md:text-base truncate">
                      {profile.resume_name || "resume.pdf"}
                    </p>
                    <p className="text-xs text-muted-foreground">Ready for download</p>
                  </div>
                </div>
                <div className="flex gap-2 self-end sm:self-center">
                  <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                    <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-1" /> View
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDeleteResume} className="flex-1 sm:flex-none">
                    <Trash2 className="h-4 w-4 mr-1 text-red-500" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-lg p-6 md:p-8 text-center">
              <div className="flex flex-col items-center">
                <div className="p-3 bg-secondary/10 rounded-full mb-4">
                  <FileUser className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-sm md:text-base mb-1">No resume uploaded</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-4">
                  Upload a PDF file to let visitors download your resume
                </p>
                <Label htmlFor="resume-upload" className="cursor-pointer">
                  <Button variant="outline" asChild className="w-full sm:w-auto">
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingResume ? "Uploading..." : "Upload Resume"}
                    </span>
                  </Button>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleResumeUpload}
                    disabled={uploadingResume}
                  />
                </Label>
                {uploadingResume && (
                  <div className="flex items-center gap-2 mt-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg md:text-xl">Social Links</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Update your social media profiles and contact links
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {socialLinks.map((link) => {
            const Icon = getSocialIcon(link.platform);
            return (
              <div key={link.id || link.platform} className="space-y-2">
                <Label htmlFor={link.platform} className="text-sm md:text-base font-medium capitalize flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {link.platform}
                </Label>
                <div className="relative">
                  <Input
                    id={link.platform}
                    value={link.url}
                    onChange={(e) => {
                      const updated = socialLinks.map(l => 
                        l.id === link.id ? { ...l, url: e.target.value } : l
                      );
                      setSocialLinks(updated);
                    }}
                    onBlur={() => handleSocialUpdate(link.id, link.url)}
                    placeholder={getSocialPlaceholder(link.platform)}
                    className="h-10 md:h-11 text-base"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {link.platform === 'github' && 'Example: https://github.com/username'}
                  {link.platform === 'linkedin' && 'Example: https://linkedin.com/in/username'}
                  {link.platform === 'email' && 'Example: mailto:your@email.com'}
                  {link.platform === 'twitter' && 'Example: https://twitter.com/username'}
                  {link.platform === 'website' && 'Example: https://yourwebsite.com'}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};