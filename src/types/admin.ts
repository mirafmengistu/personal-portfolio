// Replace the entire file with this
export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar_url?: string;
  resume_url?: string | null;
  resume_name?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SocialLink {
  id?: string;
  platform: string;
  url: string;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  display_order: number;
  skills?: Skill[];
  created_at?: string;
}

export interface Skill {
  id: string;
  category_id: string;
  name: string;
  proficiency: number;
  display_order: number;
  created_at?: string;
}

export interface ContactInfo {
  id: string;
  email: string;
  phone: string;
  location: string;
  availability: string;
  contact_form_enabled?: boolean;
  success_message?: string;
  created_at?: string;
  updated_at?: string;
}

export interface HeroSection {
  id: string;
  greeting: string;
  animated_texts: string[];
  primary_cta: string;
  secondary_cta: string;
  primary_cta_link: string;
  secondary_cta_link: string;
  show_social_links: boolean;
  enable_animated_text: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FooterSettings {
  id: string;
  brand_name: string;
  brand_tagline: string;
  copyright_text: string;
  built_with: string[];
  show_quick_links: boolean;
  show_social_links: boolean;
  show_built_with: boolean;
  quick_links: QuickLink[];
  created_at?: string;
  updated_at?: string;
}

export interface QuickLink {
  id: string;
  label: string;
  url: string;
}